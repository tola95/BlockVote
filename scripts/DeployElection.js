/**
 * Created by OmotolaBabasola1 on 07/04/2017.
 */

var electionSource = 'contract mortal { /* Define variable owner of the type address*/ address owner; /* this function is executed at initialization and sets the owner of the contract */ function mortal() { owner = msg.sender; } /* Function to recover the funds on the contract */ function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract election is mortal { mapping (bytes32 => uint8) public voteTable; bytes32[] public candidateList; function election(bytes32[] _candidateList) payable public { candidateList = _candidateList; } function countVotes(bytes32 candidate) returns (uint8) { if (isValidCandidate(candidate) == false) throw; return voteTable[candidate]; } function vote(bytes32 candidate) { if (isValidCandidate(candidate) == false) throw; voteTable[candidate] += 1; } function isValidCandidate(bytes32 candidate) returns (bool) { for (uint i = 0; i < candidateList.length; i++) { if (candidateList[i] == candidate) { return true; } } return false; } }';

var electionCompiled = web3.eth.compile.solidity(electionSource);

var _candidateList = ["Quavo", "Falz"];

var electionContract = web3.eth.contract(electionCompiled["<stdin>:election"].info.abiDefinition);

var election = electionContract.new(_candidateList,{from:web3.eth.accounts[0], data: electionCompiled["<stdin>:election"].code, gas: 400000}, function(e, contract){
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