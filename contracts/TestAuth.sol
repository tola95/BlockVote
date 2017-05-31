pragma solidity ^0.4.9;

/*
 * @title mortal
 * Functionality for killing contracts
 *  Author: Omotola Babasola
 */
contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}

contract TestAuth is mortal {

    int secret;
    address testAdminAddress;
    TestAdmin testAdmin;

    int G;
    int H;
    int Hj;
    int P;
    int Q;

    Commitment[] public commitments;
    mapping (int => int) public logTable;

    /* ----------------------- Internal Structs -------------------- */

    struct Commitment {
        int a;
        int b;
    }

    /* ----------------------- Initial configuration functions -------------------- */

    function TestAuth() {
        testAdminAddress = 0x28f48e29ed221e480e32ad18cc24fda902ed4f59;
        testAdmin = TestAdmin(testAdminAddress);
    }

    function requestAuthorityStatus() returns (bool) {
        return testAdmin.requestAuthorityStatus(address(this));
    }

    function getAddress() returns (address) {
        return address(this);
    }

    function setConfigs() {
        G = testAdmin.getG();
        H = testAdmin.getH();
        P = testAdmin.getP();
        secret = testAdmin.getSecretShare(address(this));
        Hj = mpmod(G, secret, P);
        Q = (P - 1)/2;
    }

    function getSecret() returns (int) {
        return secret;
    }

    /* ----------------------- Voting and commitment functions -------------------- */

    function vote(int x, int y, int a1, int a2, int b1, int b2,
                int d1, int d2, int r1, int r2, int challenge) returns (bool) {
        if (!verifyZKP(x,y,a1,a2,b1,b2,d1,d2,r1,r2,challenge)) {
            return false;
        }
        sendCommitment(x, y);
        return true;
    }

    function sendCommitment(int a, int b) {
        commitments.push(Commitment({
            a: a,
            b: b
        }));
    }

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

    function verifyZKP(int x, int y, int a1, int a2,
                        int b1, int b2, int d1, int d2, int r1, int r2, int challenge)
                         returns (bool) {

        return (challenge == d1 + d2) &&
                (a1 == mpmod(mpmod(G, r1, P) * mpmod(x, d1, P), 1, P)) &&
                (b1 == mpmod(mpmod(H, r1, P) * mpmod(y * G, d1, P), 1, P)) &&
                (a2 == mpmod(mpmod(G, r2, P) * mpmod(x, d2, P), 1, P)) &&
                (b2 == mpmod(mpmod(H, r2, P) * mpmod(y * mpmod(G, -1, P), d2, P), 1, P));

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

contract TestAdmin is mortal {

    function TestAdmin() {
    }

    function getP() returns (int){
    }

    function getG() returns (int) {
    }

    function getH() returns (int) {
    }

    function requestAuthorityStatus(address contractAd) payable returns (bool) {
    }

    function checkAuthorityStatus(address contractAd) returns (bool) {
    }

    function getSecretShare(address contractAd) payable returns (int){
    }

    function generateShare(uint8 n_i) returns (int) {
    }

    function mpmod(int base, int exponent, int modulus) returns (int) {
    }

    function reset() {
    }
}

