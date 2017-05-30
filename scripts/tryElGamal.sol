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

/*
 * @title tryElGamal
 * Functionality for encrypting and tallying ElGamal commitments
 *  Author: Omotola Babasola
 */
contract tryElGamal is mortal {

    struct Voter {
        bool eligible;
        bool voted;
    }

    struct Commitment {
        int a;
        int b;
    }

    address public chairPerson; /*Party in charge if administering the election*/
    mapping(address => Voter) public voters; /*Mapping of voters addresses to objects*/

    int public P; /* Prime for the ElGamal Encryption */
    int public Q; /* (P-1)/2 */
    int public G; /* Generator for the encryption, between 1 and P-1 */
    int public H; /* h must be in subgroup of F*p(between 1 and P-1) generated by g */

    Commitment[] public commitments;

    mapping (int => int) public logTable;

    function tryElGamal(int _P, int _G, int _H) {
        P = _P;
        G = _G;
        H = _H;
        Q = (P - 1)/2;
        generateLookupTable();
        chairPerson = msg.sender;
        voters[chairPerson].eligible = true;
    }

     function giveRightToVote(address voter) {
         if (msg.sender != chairPerson) {
             throw;
         }
         voters[voter].eligible = true;
     }


    function generateLookupTable() private {
        for(int i=0; i<=Q-1; i++){
            logTable[mpmod(G, i, P)] = i;
        }
    }

    function tally() returns (int) {
        Commitment memory a = tallyCommitments();
        return revealCommitment(a.a, a.b, 12);
    }

    /* a= g^r, b= (h^r . g^m) */
    function revealCommitment(int a, int b, int s) returns (int) {
        int As = mpmod(a, -s, P);
        int gm = mpmod(b * As, 1, P);
        return logG(gm);
    }

    /*Vote method*/
    function vote(int x, int y, int a1, int a2, int b1, int b2,
                int d1, int d2, int r1, int r2, int challenge) returns (bool) {
        if (!verifyZKP(x,y,a1,a2,b1,b2,d1,d2,r1,r2,challenge)) {
            return false;
        }
        sendCommitment(x, y);
    }

    function sendCommitment(int a, int b) {
        commitments.push(Commitment({
            a: a,
            b: b
        }));
    }

    function multiplyCommitments(Commitment a, Commitment b) private returns (Commitment memory) {
        Commitment memory prod;
        prod.a = mpmod(a.a * b.a, 1, P);
        prod.b = mpmod(a.b * b.b, 1, P);
        return prod;
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

    /* base^exponent % modulus */
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

    function logG(int a) returns (int) {
        return logTable[a];
    }

    /*ToDo: Update to use keccak*/
    function verifyZKP(int x, int y, int a1, int a2,
                        int b1, int b2, int d1, int d2, int r1, int r2, int challenge)
                         returns (bool) {

        return (challenge == d1 + d2) &&
                (a1 == mpmod(mpmod(G, r1, P) * mpmod(x, d1, P), 1, P)) &&
                (b1 == mpmod(mpmod(H, r1, P) * mpmod(y * G, d1, P), 1, P)) &&
                (a2 == mpmod(mpmod(G, r2, P) * mpmod(x, d2, P), 1, P)) &&
                (b2 == mpmod(mpmod(H, r2, P) * mpmod(y * mpmod(G, -1, P), d2, P), 1, P));

    }
}



