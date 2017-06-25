pragma solidity ^0.4.9;

import "./TestAdmin.sol";

/*
 * @title mortal
 * Functionality for killing contracts
 *  Author: Omotola Babasola
 */

/*
contract mortal {
    address owner;

    function mortal() { owner = msg.sender; }

    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}


contract TestAdmin is mortal {

    function TestAdmin() {
    }

    function getP() constant returns (int){
    }

    function getG() constant returns (int) {
    }

    function getH() constant returns (int) {
    }

    function getNoOfAuthorities() constant returns (uint8) {
    }

    function requestAuthorityStatus(address contractAd) payable returns (bool) {
    }

    function checkAuthorityStatus(address contractAd) payable returns (bool) {
    }

    function getSecretShare(address contractAd) payable returns (int){
    }

    function getShareIndex(address contractAd) payable returns (int) {
    }

    function generateShare(uint8 n_i) payable returns (int) {
    }

    function getLagrangeCoeff(int s_i) returns (int) {
    }

    function reset() {
    }

    function getCounter() returns (uint8) {
    }

    function getRegisteredAuthorities() constant returns (address[]) {
    }

    function getRegisteredAuthority(uint8 i) constant returns (address) {
    }

    function getSis() returns (int[]) {
    }

    function getShares() returns (int[]) {
    }

    function mpmod(int base, int exponent, int modulus) returns (int) {
    }

    function calculateRecombinantHalf(int s_is, int P, int s_i) returns (int) {
    }

    function calculateRecombinant(int s_i) returns (int) {
    }

    function modularInverse(int a, int m) returns (int) {
    }

}
*/
contract TestAuth is mortal {

    int secret;
    address testAdminAddress;
    TestAdmin testAdmin;

    int G;
    int Hj;
    int P;
    int Q;
    uint8 noOfAuthorities;

    Commitment[] commitments;
    mapping (int => int) public logTable;

    Commitment[] authorityCommitments;
    Share[] shares;

    address[] authorityAddresses;

    /* ----------------------- Internal Structs -------------------- */

    struct Commitment {
        int a;
        int b;
    }

    struct Share {
        int s_i;
        int share;
        int lagrangeCoeff;
    }

    /* ----------------------- Initial configuration functions -------------------- */

    function TestAuth(address adminAddress) {
        testAdminAddress = adminAddress;
        testAdmin = TestAdmin(testAdminAddress);
        generateLookupTable();
    }

    function requestAuthorityStatus() returns (bool) {
        return testAdmin.requestAuthorityStatus(address(this));
    }

    function getAddress() returns (address) {
        return address(this);
    }

    function setConfigs() {
        Hj = mpmod(G, secret, P);
        Q = (P - 1)/2;
        noOfAuthorities = testAdmin.getNoOfAuthorities();
    }

    function setSecret() {
        secret = testAdmin.getSecretShare(address(this));
    }

    function setGP() {
        G = testAdmin.getG();
        P = testAdmin.getP();
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

    /* ----------------------- Voting and commitment functions -------------------- */
    /* --------- Pre Deadline ------- */

    function vote(int x, int y, int a1, int a2, int b1, int b2,
                int d1, int d2, int r1, int r2, int challenge) returns (bool) {
        if (!verifyZKP(x,y,a1,a2,b1,b2,d1,d2,r1,r2,challenge)) {
            return false;
        }
        sendCommitment(x, y);
        return true;
    }

    function verifyZKP(int x, int y, int a1, int a2,
                        int b1, int b2, int d1, int d2, int r1, int r2, int challenge)
                         returns (bool) {
        TestAdmin testAdmin = TestAdmin(testAdminAddress);
        int H = testAdmin.getH();
        return (challenge == d1 + d2) &&
                (a1 == mpmod(mpmod(G, r1, P) * mpmod(x, d1, P), 1, P)) &&
                (b1 == mpmod(mpmod(H, r1, P) * mpmod(y * G, d1, P), 1, P)) &&
                (a2 == mpmod(mpmod(G, r2, P) * mpmod(x, d2, P), 1, P)) &&
                (b2 == mpmod(mpmod(H, r2, P) * mpmod(y * mpmod(G, -1, P), d2, P), 1, P));

    }

    function sendCommitment(int a, int b) {
        commitments.push(Commitment({
            a: a,
            b: b
        }));
    }

    /*--------- Post Deadline -------*/

    function tally_g() returns (int) {
        Commitment memory a = tallyCommitments();
        return a.a;
    }

    function tally_h() returns (int) {
        Commitment memory a = tallyCommitments();
        return a.b;
    }

    function tallyCommitments() private returns (Commitment memory) {
        if (commitments.length == 0) {
            throw;
        }
        Commitment memory prod = commitments[0];
        for (uint i=1; i<commitments.length; i++) {
            prod = multiplyCommitments(prod, commitments[i]);
        }
        return prod;
    }

    function multiplyCommitments(Commitment a, Commitment b) private returns (Commitment memory) {
        Commitment memory prod;
        prod.a = mpmod(a.a * b.a, 1, P);
        prod.b = mpmod(a.b * b.b, 1, P);
        return prod;
    }

    /* Receive commitment from another Authority, for tallying purposes */
    function sendAuthorityCommitment(/*address authority,*/ int x, int y) {
        /*ToDo: Check that authority is registered */

        authorityCommitments.push(Commitment({
            a: x,
            b: y
        }));
    }

    function tallyAuthorityCommitments() private returns (Commitment memory) {
         if (authorityCommitments.length != noOfAuthorities) {
             throw;
         }
         Commitment memory prod = authorityCommitments[0];
         for (uint i=1; i<authorityCommitments.length; i++) {
             prod = multiplyCommitments(prod, commitments[i]);
         }
         return prod;
    }

    function tallyAuthority_g() returns (int) {
        Commitment memory a = tallyAuthorityCommitments();
        return a.a;
    }

    function tallyAuthority_h() returns (int) {
        Commitment memory a = tallyAuthorityCommitments();
        return a.b;
    }

    /* ToDo: Receive Authority shares */
/*    function receiveShare(address authority) {
        int s_i = testAdmin.getShareIndex(authority);
        int share = testAdmin.getSecretShare(authority);
        int lagrangeCoeff = testAdmin.getLagrangeCoeff(s_i);

        shares.push(Share({
            s_i: s_i,
            share: share,
            lagrangeCoeff: lagrangeCoeff
        }));
    } */

    function revealSum(int x, int y) returns (int) {

        if (authorityAddresses.length == 0) {
            for (uint8 i=0; i<noOfAuthorities; i++) {
                authorityAddresses.push(testAdmin.getRegisteredAuthority(i));
            }
        }

        if (shares.length == 0) {
            for (i=0; i<authorityAddresses.length; i++) {
                receiveShare(authorityAddresses[i]);
            }
        }

        if (shares.length < noOfAuthorities) {
            return -1;
        }

        int divider = 1;
        for (i=0; i<shares.length; i++) {
            divider = mpmod(divider * mpmod(x, shares[i].share, P), shares[i].lagrangeCoeff, P);
        }
        int exp = mpmod(y * mpmod(divider, -1, P), 1, P);
        return logTable[exp] - 1;

    }

    function getAuthorityAddresses() returns (address[]) {
        return authorityAddresses;
    }

    function getShare(uint8 i) returns (int) {
        return shares[i].share;
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


}