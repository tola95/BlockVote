pragma solidity ^0.4.9;

contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}

contract voterBoard is mortal {

    /* Number of voters */
    uint8 noOfVoters;

    /* List of voters */
    bytes32[] public voterList;

    function voterBoard(uint8 _noOfVoters) payable public {
        noOfVoters = _noOfVoters;
        voterList = new bytes32[](noOfVoters);
    }

    function register(bytes32 voter)  {
        voterList.push(voter);
    }

    function verifyRegistered(bytes32 voter) returns (bool) {
        for(uint8 i = 0; i < voterList.length; i++) {
              if (voterList[i] == voter) {
                    return true;
              }
        }
        return false;
    }
}