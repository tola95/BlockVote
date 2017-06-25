pragma solidity ^0.4.9;

import "./BulletinBoard.sol";

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

contract Administrator is mortal {

    struct Authority {
        uint8 id;
        address ad;
        bool registered;
    }

    struct Voter {
        uint8 id;
        address ad;
        uint8 authorityID;
    }

    struct Commitment {
        int a;
        int b;
    }

    mapping(address => Authority) public authorities;
    address[] authorityAddresses;

    uint8 private counter = 1; /*Counter for authorities*/
    uint8 public noOfAuthorities = 3; /*Number of share colluding authorities*/

    int[] private poly = [12, 29, 51];
    int private N;
    int[] private shares;
    int[] private s_is;

    int P;
    int G;
    int Q;
    int H;

    uint8[] voterIDs;
    Voter[] voters;

    BulletinBoard bulletinBoard;
    mapping (int => int) public logTable;
    Commitment commitment;

    function Administrator(int _P, int _G, uint8[] _voterIDs) {
        P = _P;
        G = _G;
        H = mpmod(G, poly[0], P);
        Q = (P - 1)/2;
        N = P;
        voterIDs = _voterIDs;
    }

    function getP() constant returns (int){
        return P;
    }

    function getG() constant returns (int) {
        return G;
    }

    function getH() constant returns (int) {
        return H;
    }

    function getNoOfAuthorities() constant returns (uint8) {
        return noOfAuthorities;
    }

    function requestAuthorityStatus(address contractAd) payable returns (bool) {
        if (authorities[contractAd].registered == true || counter > noOfAuthorities) {
            return false;
        }
        authorities[contractAd].id = counter;
        counter++;
        authorities[contractAd].ad = contractAd;
        authorities[contractAd].registered = true;
        authorityAddresses.push(contractAd);
        return true;
    }

    function checkAuthorityStatus(address contractAd) payable returns (bool) {
        return authorities[contractAd].registered;
    }


    function getSecretShare(address contractAd) payable returns (int){
        if (authorities[contractAd].registered == false) {
            return -1;
        }
        uint8 id = authorities[contractAd].id;
        s_is.push(id);
        return generateShare(id);
    }

    function getShareIndex(address contractAd) payable returns (int) {
        if (authorities[contractAd].registered == false) {
            return -1;
        }

        return authorities[contractAd].id;
    }

    function generateShare(uint8 n_i) payable returns (int) {
        int share = 0;
        int i = 0;
        int l = int(poly.length);
        while (i < l) {
            int coeff = poly[uint(i)];
            share = mpmod(share + mpmod(coeff * mpmod(n_i, i, N), 1, N), 1, N);
            i++;
        }
        return share;
    }

    /* ------------ BulletinBoard Registration ------------------- */

    function setBulletinBoard(address bulletinBoardAd) {
        bulletinBoard = BulletinBoard(bulletinBoardAd);
    }

    function setCommitment() {
        commitment.a = bulletinBoard.tally_g();
        commitment.b = bulletinBoard.tally_h();
    }



    /* ------------ Voter Registration ------------------- */

    function register(uint8 id) returns (uint8) {
        address voterAd = msg.sender;
        bool eligible;
        for (uint i=0; i<voterIDs.length; i++) {
            if (voterIDs[i] == id) {
                eligible = true;
                break;
            }
        }

        if (!eligible) {
            return 0;
        } else {

            voters.push(Voter({
                id: id,
                ad: voterAd,
                authorityID: id % noOfAuthorities
            }));
            return id % noOfAuthorities;
        }

    }

    function isEligible(address voterAd) returns (bool) {
        for (uint8 i=0; i<voters.length; i++) {
            if ((voters[i].ad == voterAd) && (authorities[msg.sender].id == voters[i].authorityID)) {
                return true;
            }
        }
        return false;
    }

    function revealSum(int s) returns (int) {
        int As = mpmod(commitment.a, -s, P);
        int gm = mpmod(commitment.b * As, 1, P);
        return logG(gm);
    }

    function logG(int a) returns (int) {
        return logTable[a];
    }

    /* ------------ Useful for Debugging ------------------- */

    function getCounter() returns (uint8){
        return counter;
    }

    function getRegisteredAuthorities() constant returns (address[]) {
        return authorityAddresses;
    }

    address[] printedVoters;
    function getRegisteredVoters() returns (address[]) {
        for (uint8 i=0; i<voters.length; i++) {
            printedVoters.push(voters[i].ad);
        }
        return printedVoters;
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


}