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

contract TestAdmin is mortal {

    struct Authority {
        uint8 id;
        address ad;
        bool registered;
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

    function TestAdmin(int _P, int _G) {
        P = _P;
        G = _G;
        H = mpmod(G, poly[0], P);
        Q = (P - 1)/2;
        N = P;
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
        if (authorities[contractAd].registered == true || counter >= noOfAuthorities) {
            return false;
        }
        authorities[contractAd].id = counter++;
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

    function getLagrangeCoeff(int s_i) returns (int) {
        return calculateRecombinant(s_i);
    }

    function reset() {
        counter = 0;
        delete shares;
        delete s_is;
        for (uint i=0; i<authorityAddresses.length; i++) {
            delete authorities[authorityAddresses[i]];
        }
        delete authorityAddresses;
    }

    function getCounter() returns (uint8){
        return counter;
    }

    function getRegisteredAuthorities() returns (address[]) {
        return authorityAddresses;
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

    function calculateRecombinantHalf(int s_is, int P, int s_i) returns (int) {
        int b = modularInverse(s_i - s_is, P);
        return mpmod((-s_is + P) * b, 1, P);
    }

    function calculateRecombinant(int s_i) returns (int) {
        int recombs = 1;
        for (uint i=0; i<s_is.length; i++) {
            if (s_is[i] != s_i) {
                recombs = mpmod(recombs * calculateRecombinantHalf(s_is[i], P, s_i), 1, P) ;
            }
        }
        return recombs;
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