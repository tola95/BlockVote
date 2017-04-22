pragma solidity ^0.4.9;

contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}

contract election is mortal {

    /* Map of candidate names to number of votes */
    mapping (bytes32 => uint8) public voteTable;

    bytes32[] public candidateList;

    /* Initiate an election with a list of candidates */
    function election(bytes32[] _candidateList) payable public {
        candidateList = _candidateList;
    }

    function countVotes(bytes32 candidate) returns (uint8) {
        if (isValidCandidate(candidate) == false) throw;
        return voteTable[candidate];
    }

    function vote(bytes32 candidate) {
        if (isValidCandidate(candidate) == false) throw;
        voteTable[candidate] += 1;
    }

    function isValidCandidate(bytes32 candidate) returns (bool) {
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}