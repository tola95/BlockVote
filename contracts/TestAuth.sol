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
        secret = testAdmin.getSecretShare(address(this));
    }

    function getSecret() returns (int) {
        return secret;
    }

}

contract TestAdmin is mortal {

    function TestAdmin() {
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

