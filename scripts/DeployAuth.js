/**
 * Created by OmotolaBabasola1 on 04/06/2017.
 */

var testAuthSource = 'pragma solidity ^0.4.9; /* * @title mortal * Functionality for killing contracts * Author: Omotola Babasola */ contract mortal { /* Define variable owner of the type address*/ address owner; /* this function is executed at initialization and sets the owner of the contract */ function mortal() { owner = msg.sender; } /* Function to recover the funds on the contract */ function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract TestAdmin is mortal { function TestAdmin() { } function getP() constant returns (int){ } function getG() constant returns (int) { } function getH() constant returns (int) { } function getNoOfAuthorities() constant returns (uint8) { } function requestAuthorityStatus(address contractAd) payable returns (bool) { } function checkAuthorityStatus(address contractAd) payable returns (bool) { } function getSecretShare(address contractAd) payable returns (int){ } function getShareIndex(address contractAd) payable returns (int) { } function generateShare(uint8 n_i) payable returns (int) { } function getLagrangeCoeff(int s_i) returns (int) { } function reset() { } function getCounter() returns (uint8) { } function getRegisteredAuthorities() constant returns (address[]) { } function getRegisteredAuthority(uint8 i) constant returns (address) { } function getSis() returns (int[]) { } function getShares() returns (int[]) { } function mpmod(int base, int exponent, int modulus) returns (int) { } function calculateRecombinantHalf(int s_is, int P, int s_i) returns (int) { } function calculateRecombinant(int s_i) returns (int) { } function modularInverse(int a, int m) returns (int) { } } contract TestAuth is mortal { int secret; address testAdminAddress = 0xa7e814e46f8331e8f72ae9a64806e8bc7db21e20; int G; int Hj; int P; int Q; uint8 noOfAuthorities; Commitment[] commitments; mapping (int => int) public logTable; Commitment[] authorityCommitments; Share[] shares; address[] authorityAddresses; /* ----------------------- Internal Structs -------------------- */ struct Commitment { int a; int b; } struct Share { int s_i; int share; int lagrangeCoeff; } /* ----------------------- Initial configuration functions -------------------- */ function TestAuth() { generateLookupTable(); } function requestAuthorityStatus() returns (bool) { TestAdmin testAdmin = TestAdmin(testAdminAddress); return testAdmin.requestAuthorityStatus(address(this)); } function getAddress() returns (address) { return address(this); } function setConfigs() { TestAdmin testAdmin = TestAdmin(testAdminAddress); Hj = mpmod(G, secret, P); Q = (P - 1)/2; noOfAuthorities = testAdmin.getNoOfAuthorities(); } function setSecret() { TestAdmin testAdmin = TestAdmin(testAdminAddress); secret = testAdmin.getSecretShare(address(this)); } function setGP() { TestAdmin testAdmin = TestAdmin(testAdminAddress); G = testAdmin.getG(); P = testAdmin.getP(); } function getG() returns (int) { return G; } function getP() returns (int) { return P; } function getH() returns (int) { return Hj; } function getSecret() returns (int) { return secret; } /* ----------------------- Voting and commitment functions -------------------- */ /* --------- Pre Deadline ------- */ function vote(int x, int y, int a1, int a2, int b1, int b2, int d1, int d2, int r1, int r2, int challenge) returns (bool) { if (!verifyZKP(x,y,a1,a2,b1,b2,d1,d2,r1,r2,challenge)) { return false; } sendCommitment(x, y); return true; } function verifyZKP(int x, int y, int a1, int a2, int b1, int b2, int d1, int d2, int r1, int r2, int challenge) returns (bool) { TestAdmin testAdmin = TestAdmin(testAdminAddress); int H = testAdmin.getH(); return (challenge == d1 + d2) && (a1 == mpmod(mpmod(G, r1, P) * mpmod(x, d1, P), 1, P)) && (b1 == mpmod(mpmod(H, r1, P) * mpmod(y * G, d1, P), 1, P)) && (a2 == mpmod(mpmod(G, r2, P) * mpmod(x, d2, P), 1, P)) && (b2 == mpmod(mpmod(H, r2, P) * mpmod(y * mpmod(G, -1, P), d2, P), 1, P)); } function sendCommitment(int a, int b) { commitments.push(Commitment({ a: a, b: b })); } /*--------- Post Deadline -------*/ function tally_g() returns (int) { Commitment memory a = tallyCommitments(); return a.a; } function tally_h() returns (int) { Commitment memory a = tallyCommitments(); return a.b; } function tallyCommitments() private returns (Commitment memory) { if (commitments.length == 0) { throw; } Commitment memory prod = commitments[0]; for (uint i=1; i<commitments.length; i++) { prod = multiplyCommitments(prod, commitments[i]); } return prod; } function multiplyCommitments(Commitment a, Commitment b) private returns (Commitment memory) { Commitment memory prod; prod.a = mpmod(a.a * b.a, 1, P); prod.b = mpmod(a.b * b.b, 1, P); return prod; } /* Receive commitment from another Authority, for tallying purposes */ function sendAuthorityCommitment(address authority, int x, int y) { /*ToDo: Check that authority is registered */ authorityCommitments.push(Commitment({ a: x, b: y })); } function tallyAuthorityCommitments() private returns (Commitment memory) { if (authorityCommitments.length != noOfAuthorities) { throw; } Commitment memory prod = authorityCommitments[0]; for (uint i=1; i<authorityCommitments.length; i++) { prod = multiplyCommitments(prod, commitments[i]); } return prod; } function tallyAuthority_g() returns (int) { Commitment memory a = tallyAuthorityCommitments(); return a.a; } function tallyAuthority_h() returns (int) { Commitment memory a = tallyAuthorityCommitments(); return a.b; } /* ToDo: Receive Authority shares */ function receiveShare(address authority) { TestAdmin testAdmin = TestAdmin(testAdminAddress); int s_i = testAdmin.getShareIndex(authority); int share = testAdmin.getSecretShare(authority); int lagrangeCoeff = testAdmin.getLagrangeCoeff(s_i); shares.push(Share({ s_i: s_i, share: share, lagrangeCoeff: lagrangeCoeff })); } function revealSum(int x, int y) returns (int) { TestAdmin testAdmin = TestAdmin(testAdminAddress); if (authorityAddresses.length == 0) { for (uint8 i=0; i<noOfAuthorities; i++) { authorityAddresses.push(testAdmin.getRegisteredAuthority(i)); } } if (shares.length == 0) { for (i=0; i<authorityAddresses.length; i++) { receiveShare(authorityAddresses[i]); } } if (shares.length < noOfAuthorities) { return -1; } int divider = 1; for (i=0; i<shares.length; i++) { divider = mpmod(divider * mpmod(x, shares[i].share, P), shares[i].lagrangeCoeff, P); } int exp = mpmod(y * mpmod(divider, -1, P), 1, P); return logTable[exp] - 1; } function getAuthorityAddresses() returns (address[]) { return authorityAddresses; } function getShare(uint8 i) returns (int) { return shares[i].share; } /* ----------------------- Auxillary Mathematical Functions -------------------- */ function mpmod(int base, int exponent, int modulus) returns (int) { if ((base < 1) || (modulus < 1)) { throw; } if (exponent < 0) { while (exponent < 0) { exponent += ((modulus - 1)/2); } } int result = 1; while (exponent > 0) { if ((exponent % 2) == 1) { result = (result * base) % modulus; } base = (base * base) % modulus; exponent = exponent / 2; } return result; } function generateLookupTable() private { for(int i=0; i<=Q-1; i++){ logTable[mpmod(G, i, P)] = i; } } }';
/*
var testAuthCompiled = web3.eth.compile.solidity(testAuthSource);
var testAuthContract = web3.eth.contract(testAuthCompiled["<stdin>:TestAuth"].info.abiDefinition);
var testAuth = testAuthContract.new({from:web3.eth.accounts[0], data:testAuthCompiled["<stdin>:TestAuth"].code, gas: 3000000}, function(e, contract){
    if (!e) {
        if (!contract.address) {
            console.log("Contract transaction send: TransactionHash: " +
                contract.transactionHash + " waiting to be mined...");
        } else {
            console.log("Contract mined! Address: " + contract.address);
            console.log(contract);

        }
    } else {
        console.log(e);
    }
});
testAuth.requestAuthorityStatus();
testAuth.setGP();
testAuth.setSecret();
testAuth.setConfigs();
*/

var testAuthData = testAuthContract.new.getData({from:web3.eth.accounts[0], data:testAuthCompiled["<stdin>:TestAuth"].code, gas: 3000000})
eth.estimateGas({data: testAuthData})

var d = testAuth.requestAuthorityStatus().getData({from:web3.eth.accounts[0], gas: 3000000})

web3.eth.defaultAccount = web3.eth.accounts[0];

var administrator;Administrator.deployed().then(function(instance) {administrator = instance;return administrator.getRegisteredAuthorities.call();});

var authority;Authority.deployed().then(function(instance) {authority = instance; return authority.requestAuthorityStatus(); });
var authority2;Authority2.deployed().then(function(instance) {authority2 = instance; return authority2.requestAuthorityStatus(); });
var authority3;Authority3.deployed().then(function(instance) {authority3 = instance; return authority3.requestAuthorityStatus(); });
var bulletinBoard; BulletinBoard.deployed().then(function(instance){bulletinBoard = instance;});

administrator.getRegisteredAuthorities.call();

authority.setConfigs();
authority.setBulletinBoard(bulletinBoard.address);
authority2.setConfigs();
authority2.setBulletinBoard(bulletinBoard.address);
authority3.setConfigs();
authority3.setBulletinBoard(bulletinBoard.address);

authority.getG.call();
authority.getSecret.call();

administrator.register(1);

authority.vote(85, 25, 11, 83, 48, 62, 41, -19, 17, 1024, 22);
authority.vote.call(85, 25, 11, 83, 48, 62, 41, -19, 17, 1024, 22);

authority.sendShare(authority2.address, authority3.address);
authority2.sendShare(authority.address, authority3.address);
authority3.sendShare(authority.address, authority2.address);

authority.setCommitment(authority2.address, authority3.address);
authority2.setCommitment(authority.address, authority3.address);
authority3.setCommitment(authority.address, authority2.address);

authority2.revealSum.call(authority2.generateSecret());
