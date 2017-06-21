/**
 * Created by OmotolaBabasola1 on 04/06/2017.
 */

var AdministratorSource = 'pragma solidity ^0.4.9; /* * @title mortal * Functionality for killing contracts * Author: Omotola Babasola */ contract mortal { /* Define variable owner of the type address*/ address owner; /* this function is executed at initialization and sets the owner of the contract */ function mortal() { owner = msg.sender; } /* Function to recover the funds on the contract */ function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract Administrator is mortal { struct Authority { uint8 id; address ad; bool registered; } mapping(address => Authority) public authorities; address[] authorityAddresses; uint8 private counter = 1; /*Counter for authorities*/ uint8 public noOfAuthorities = 3; /*Number of share colluding authorities*/ int[] private poly = [12, 29, 51]; int private N; int[] private shares; int[] private s_is; int P; int G; int Q; int H; function TestAdmin(int _P, int _G) { P = _P; G = _G; H = mpmod(G, poly[0], P); Q = (P - 1)/2; N = P; } function getP() constant returns (int){ return P; } function getG() constant returns (int) { return G; } function getH() constant returns (int) { return H; } function requestAuthorityStatus(address contractAd) payable returns (bool) { /* if (authorities[contractAd].registered == true || counter > noOfAuthorities) { return false; } */ authorities[contractAd].id = counter; counter++; authorities[contractAd].ad = contractAd; authorities[contractAd].registered = true; authorityAddresses.push(contractAd); return true; } function checkAuthorityStatus(address contractAd) payable returns (bool) { return authorities[contractAd].registered; } function getSecretShare(address contractAd) payable returns (int){ if (authorities[contractAd].registered == false) { return -1; } uint8 id = authorities[contractAd].id; s_is.push(id); return generateShare(id); } function getShareIndex(address contractAd) payable returns (int) { if (authorities[contractAd].registered == false) { return -1; } return authorities[contractAd].id; } function generateShare(uint8 n_i) payable returns (int) { int share = 0; int i = 0; int l = int(poly.length); while (i < l) { int coeff = poly[uint(i)]; share = mpmod(share + mpmod(coeff * mpmod(n_i, i, N), 1, N), 1, N); i++; } return share; } /* ------------ Useful for Debugging ------------------- */ function getCounter() returns (uint8){ return counter; } function getRegisteredAuthorities() constant returns (address[]) { return authorityAddresses; } function getRegisteredAuthority(uint8 i) constant returns (address) { return authorityAddresses[i]; } function getSis() returns (int[]) { return s_is; } function getShares() returns (int[]) { return shares; } /* ----------------------- Auxillary Mathematical Functions -------------------- */ function mpmod(int base, int exponent, int modulus) returns (int) { if ((base < 1) || (modulus < 1)) { throw; } if (exponent < 0) { while (exponent < 0) { exponent += ((modulus - 1)/2); } } int result = 1; while (exponent > 0) { if ((exponent % 2) == 1) { result = (result * base) % modulus; } base = (base * base) % modulus; exponent = exponent / 2; } return result; } }';

var testAdminCompiled = web3.eth.compile.solidity(testAdminSource);
var _P = 107;
var _G = 34;
var AdministratorContract = web3.eth.contract(AdministratorCompiled["<stdin>:Administrator"].info.abiDefinition);
var Administrator = AdministratorContract.new(_P, _G, {from:web3.eth.accounts[0], data:AdministratorCompiled["<stdin>:TestAdmin"].code, gas: 3000000}, function(e, contract){
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


/*
var testAdminData = testAdminContract.new.getData(_P, _G, {from:web3.eth.accounts[0], data:testAdminCompiled["<stdin>:TestAdmin"].code, gas: 3000000})
eth.estimateGas({data: testAdminData})
*/

var administrator;Administrator.deployed().then(function(instance) {administrator = instance;return administrator.getRegisteredAuthorities.call();});