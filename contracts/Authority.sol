pragma solidity ^0.4.9;

import "./Administrator.sol";
import "./Authority2.sol";
import "./Authority3.sol";
import "./BulletinBoard.sol";

contract Authority {

    int secret;
    int shareIndex;
    address testAdminAddress;
    Administrator testAdmin;

    int G;
    int Hj;
    int P;
    int Q;
    uint8 noOfAuthorities;

    Commitment commitment;
    Share[] shares;
    mapping (int => int) public logTable;

    BulletinBoard bulletinBoard;

    /* ----------------------- Internal Structs -------------------- */

    struct Commitment {
        int a;
        int b;
    }

    struct Share {
        int secret;
        int shareIndex;
    }

    /* ----------------------- Initial configuration functions -------------------- */

    function Authority(address adminAddress) {
        testAdminAddress = adminAddress;
        testAdmin = Administrator(testAdminAddress);

    }

    function requestAuthorityStatus() returns (bool) {
        return testAdmin.requestAuthorityStatus(address(this));
    }

    function getAddress() returns (address) {
        return address(this);
    }

    function setConfigs() {
        G = testAdmin.getG();
        P = testAdmin.getP();
        secret = testAdmin.getSecretShare(address(this));
        shareIndex = testAdmin.getShareIndex(address(this));
        shares.push(Share({
            secret: secret,
            shareIndex: shareIndex
        }));
        noOfAuthorities = testAdmin.getNoOfAuthorities();
        Hj = mpmod(G, secret, P);
        Q = (P - 1)/2;
        generateLookupTable();
    }

    function getG() returns (int) {
        return G;
    }

    function getP() returns (int) {
        return P;
    }

    function getH() returns (int) {
        return Hj;
    }

    function getSecret() returns (int) {
        return secret;
    }

    /* ------------ BulletinBoard Registration ------------------- */

    function setBulletinBoard(address bulletinBoardAd) {
        bulletinBoard = BulletinBoard(bulletinBoardAd);
    }

    function setCommitment() {
        commitment.a = bulletinBoard.tally_g();
        commitment.b = bulletinBoard.tally_h();
    }

    function getCommitmentG() returns (int) {
        return commitment.a;
    }

    function getCommitmentH() returns (int) {
        return commitment.b;
    }


    /* ----------------------- Voting and commitment functions -------------------- */
    /* --------- Pre Deadline ------- */

    function vote(int x, int y, int a1, int a2, int b1, int b2,
                int d1, int d2, int r1, int r2, int challenge) returns (bool) {
        if (!verifyZKP(x,y,a1,a2,b1,b2,d1,d2,r1,r2,challenge) || !testAdmin.isEligible(msg.sender)) {
            return false;
        }
        return sendCommitment(x, y);
    }

    function verifyZKP(int x, int y, int a1, int a2,
                        int b1, int b2, int d1, int d2, int r1, int r2, int challenge)
                         returns (bool) {
        int H = testAdmin.getH();
        return (challenge == d1 + d2) &&
                (a1 == mpmod(mpmod(G, r1, P) * mpmod(x, d1, P), 1, P)) &&
                (b1 == mpmod(mpmod(H, r1, P) * mpmod(y * G, d1, P), 1, P)) &&
                (a2 == mpmod(mpmod(G, r2, P) * mpmod(x, d2, P), 1, P)) &&
                (b2 == mpmod(mpmod(H, r2, P) * mpmod(y * mpmod(G, -1, P), d2, P), 1, P));

    }

    function sendCommitment(int a, int b) returns (bool) {
        return bulletinBoard.sendCommitment(a, b);
    }

    /* ----------------------- Reconstruction -------------------------------------- */

    function receiveShare(int secret, int shareIndex) {
        shares.push(Share({
            secret: secret,
            shareIndex: shareIndex
        }));
    }

    function sendShare(address authority2Ad, address authority3Ad) {
        Authority2(authority2Ad).receiveShare(secret, shareIndex);
        Authority3(authority3Ad).receiveShare(secret, shareIndex);
    }

    int[] rs;
    function generateSecret() returns (int) {
        for (uint8 i=0; i<shares.length; i++) {
            int r_i_y = calculateRecombinant(shares, shares[i], P);
            rs.push(r_i_y);
        }
        return addRecombinants(shares, rs, P);
    }

    int[] printedShares;
    function printShares() returns (int[]) {
        for (uint8 i=0; i<shares.length; i++) {
           printedShares.push(shares[i].secret);
           printedShares.push(shares[i].shareIndex);
        }
        return printedShares;
    }

    function revealSum(int s) returns (int) {
        int As = mpmod(commitment.a, -s, P);
        int gm = mpmod(commitment.b * As, 1, P);
        return logG(gm);
    }

    function logG(int a) returns (int) {
        return logTable[a];
    }


    /* ----------------------- Auxillary Mathematical Functions -------------------- */

    function mpmod(int base, int exponent, int modulus) returns (int) {
        if ((base < 1) || (modulus < 1)) {
            throw;
        }
        if (exponent < 0) {
            while (exponent < 0) {
                exponent += ((modulus - 1)/2);
            }
        }
        int result = 1;
        while (exponent > 0) {
            if ((exponent % 2) == 1) {
                result = (result * base) % modulus;
            }
            base = (base * base) % modulus;
            exponent = exponent / 2;
        }
        return result;
    }

    function generateLookupTable() private {
        for(int i=0; i<=Q-1; i++){
            logTable[mpmod(G, i, P)] = i;
        }
    }

    function calculateRecombinant(Share[] shares, Share share, int P) private returns (int) {
        int recombs = 1;
        for (uint8 i=0; i<shares.length; i++) {
            if (share.shareIndex != shares[i].shareIndex) {
                recombs = mpmod(recombs * calculateRecombinantHalf(shares[i].shareIndex, P, share.shareIndex), 1, P);
            }
        }
        return recombs;
    }

    function calculateRecombinantHalf(int s_is, int P, int s_i) returns (int) {
        int b = modularInverse(s_i - s_is, P);
        return mpmod((-s_is + P) * b, 1, P);
    }

    function addRecombinants(Share[] shares, int[] rs, int P) private returns (int) {
        int s = 0;
        for (uint8 j = 0; j < shares.length; j++) {
            s = mpmod(s + mpmod(shares[j].secret * rs[j], 1, P), 1, P);
        }
        return s;
    }

    function modularInverse(int a, int m) returns (int) {
        if (a < 0) {
            a = a + m;
        }
        for (var i=1; i<m; i++) {
            if (mpmod(a * i, 1, m) == 1) {
                return i;
            }
        }
        return -1;
    }

}