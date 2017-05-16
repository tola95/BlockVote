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

var blindElectionSource = 'pragma solidity ^0.4.9; contract mortal { /* Define variable owner of the type address*/ address owner; /* this function is executed at initialization and sets the owner of the contract */ function mortal() { owner = msg.sender; } /* Function to recover the funds on the contract */ function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract blindElection is mortal { struct Voter { bool eligible; bool voted; uint vote; bytes32 blindedVote; } struct Candidate { bytes32 name; uint votes; } /* Important Entities */ address public chairPerson; /*Party in charge if administering the election*/ mapping(address => Voter) public voters; /*Mapping of voters addresses to objects*/ Candidate[] public candidates; /*List of candidate objects*/ /*Time Considerations*/ uint public electionStart; /*Time the election started*/ uint public electionEnd; /*How long the election will last*/ bool electionEnded; /*set to true at the end of the election*/ /*Events to be fired on changes, for logging purposes event Voted(address voter, uint candidate); event ElectionEnded(address winner, uint amount);*/ /*Modifiers for validating time constrained inputs modifier onlyBefore(uint _time) { if (now >= _time) throw; _; } modifier onlyAfter(uint _time) { if (now <= _time) throw; _; }*/ function blindElection(bytes32[] candidateNames, uint electionDuration) { chairPerson = msg.sender; voters[chairPerson].eligible = true; electionStart = now; electionEnd = electionStart + electionDuration; for (uint i = 0; i < candidateNames.length; i++) { candidates.push(Candidate({ name: candidateNames[i], votes: 0 })); } } function giveRightToVote(address voter) { if (msg.sender != chairPerson || voters[voter].voted) { throw; } voters[voter].eligible = true; } function blindVote(bytes32 _blindedVote) { Voter sender = voters[msg.sender]; if (sender.voted || sender.eligible != true || electionEnded ) { throw; } sender.voted = true; sender.blindedVote = _blindedVote; } function revealVote(uint candidateIndex, uint secret) { Voter sender = voters[msg.sender]; if (sender.blindedVote != keccak256(candidateIndex, secret)) { throw; } sender.vote = candidateIndex; candidates[candidateIndex].votes += 1; /*Voted(msg.sender, candidateIndex);*/ } /*Moot atm*/ function vote(uint candidateIndex) payable /*onlyBefore(electionEnd)*/ { Voter sender = voters[msg.sender]; if (sender.voted || sender.eligible != true ) { throw; } sender.voted = true; sender.vote = candidateIndex; candidates[candidateIndex].votes += 1; /*Voted(msg.sender, candidateIndex);*/ } function countVotes() constant returns (uint winningCandidate) /*onlyAfter(electionEnd)*/ { uint winningVoteCount = 0; for (uint i = 0; i < candidates.length; i++) { if (candidates[i].votes > winningVoteCount) { winningVoteCount = candidates[i].votes; winningCandidate = i; } } electionEnded = true; /*ElectionEnded(address winner, uint amount);*/ } function winnerName() constant returns (bytes32 winnerName) { winnerName = candidates[countVotes()].name; } }';
var blindElectionCompiled = web3.eth.compile.solidity(blindElectionSource);
var candidateNames = ['Quavo', 'Falz'];
var electionDuration = 0;
var blindElectionContract = web3.eth.contract(blindElectionCompiled["<stdin>:blindElection"].info.abiDefinition);
var blindElection = blindElectionContract.new(candidateNames, electionDuration, {from:web3.eth.accounts[0], data: blindElectionCompiled["<stdin>:blindElection"].code, gas: 1000000}, function(e, contract){
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

var tryElGamalSource = 'pragma solidity ^0.4.9; /* * @title mortal * Functionality for killing contracts * Author: Omotola Babasola */ contract mortal { /* Define variable owner of the type address*/ address owner; /* this function is executed at initialization and sets the owner of the contract */ function mortal() { owner = msg.sender; } /* Function to recover the funds on the contract */ function kill() { if (msg.sender == owner) selfdestruct(owner); } } /* * @title tryElGamal * Functionality for encrypting and tallying ElGamal commitments * Author: Omotola Babasola */ contract tryElGamal is mortal { struct Commitment { int a; int b; } int public P; /* Prime for the ElGamal Encryption */ int public G; /* Generator for the encryption, between 1 and P-1 */ int public H; /* h must be in subgroup of F*p(between 1 and P-1) generated by g */ Commitment[] public commitments; mapping (int => int) public logTable; function tryElGamal(int _P, int _G, int _H) { P = _P; G = _G; H = _H; generateLookupTable(); } function generateLookupTable() private { int Q = (P - 1)/2; for(int i=0; i<=Q-1; i++){ logTable[mpmod(G, i, P)] = i; } } function tally() returns (int) { Commitment memory a = tallyCommitments(); return revealCommitment(a.a, a.b, 12); } /* a= g^r, b= (h^r . g^m) */ function revealCommitment(int a, int b, int s) returns (int) { var As = mpmod(a, -s, P); var gm = mpmod(b * As, 1, P); return logG(gm) + 1; } function sendCommitment(int a, int b) { commitments.push(Commitment({ a: a, b: b })); } function multiplyCommitments(Commitment a, Commitment b) private returns (Commitment memory) { Commitment memory prod; prod.a = mpmod(a.a * b.a, 1, P); prod.b = mpmod(a.b * b.b, 1, P); return prod; } function tallyCommitments() private returns (Commitment memory) { if (commitments.length == 0) { throw; } Commitment memory prod = commitments[0]; for (uint i=1; i<commitments.length; i++) { prod = multiplyCommitments(prod, commitments[i]); } return prod; } /* base^exponent % modulus */ function mpmod(int base, int exponent, int modulus) returns (int) { if ((base < 1) || (modulus < 1)) { throw; } if (exponent < 0) { while (exponent < 0) { exponent += ((modulus - 1)/2); } } int result = 1; while (exponent > 0) { if ((exponent % 2) == 1) { result = (result * base) % modulus; } base = (base * base) % modulus; exponent = exponent / 2; } return result; } function logG(int a) returns (int) { return logTable[a]; } }';
var tryElGamalCompiled = web3.eth.compile.solidity(tryElGamalSource);
var _P = 107;
var _G = 34;
var _H = 57;
var tryElGamalContract = web3.eth.contract(tryElGamalCompiled["<stdin>:tryElGamal"].info.abiDefinition);
var tryElGamal = tryElGamalContract.new(_P, _G, _H, {from:web3.eth.accounts[0], data: tryElGamalCompiled["<stdin>:tryElGamal"].code, gas: 2000000}, function(e, contract){
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
var tryElGamalABI = tryElGamalCompiled["<stdin>:tryElGamal"].info.abiDefinition;
var tryElGamalAddress = tryElGamal.address;


var electionABI = [{
    constant: false,
    inputs: [{
        name: "candidate",
        type: "bytes32"
    }],
    name: "countVotes",
    outputs: [{
        name: "",
        type: "uint8"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [],
    name: "kill",
    outputs: [],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "",
        type: "bytes32"
    }],
    name: "voteTable",
    outputs: [{
        name: "",
        type: "uint8"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "candidate",
        type: "bytes32"
    }],
    name: "isValidCandidate",
    outputs: [{
        name: "",
        type: "bool"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "candidate",
        type: "bytes32"
    }],
    name: "vote",
    outputs: [],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "",
        type: "uint256"
    }],
    name: "candidateList",
    outputs: [{
        name: "",
        type: "bytes32"
    }],
    payable: false,
    type: "function"
}, {
    inputs: [{
        name: "_candidateList",
        type: "bytes32[]"
    }],
    payable: true,
    type: "constructor"
}];
var electionAddress = "0x97ec7b30d6376cd74bfe24c16c0053f8f7f58272";
var election = web3.eth.contract(electionABI).at(electionAddress);

var blindElectionAddress = "0x62d83b8f5bdedd47a1ff4460b911d874c4ae7d7b";
var blindElectionABI = [{
    constant: false,
    inputs: [{
        name: "candidateIndex",
        type: "uint256"
    }],
    name: "vote",
    outputs: [],
    payable: true,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "candidateIndex",
        type: "uint256"
    }, {
        name: "secret",
        type: "uint256"
    }],
    name: "revealVote",
    outputs: [],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "",
        type: "uint256"
    }],
    name: "candidates",
    outputs: [{
        name: "name",
        type: "bytes32"
    }, {
        name: "votes",
        type: "uint256"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [],
    name: "kill",
    outputs: [],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "voter",
        type: "address"
    }],
    name: "giveRightToVote",
    outputs: [],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "",
        type: "address"
    }],
    name: "voters",
    outputs: [{
        name: "eligible",
        type: "bool"
    }, {
        name: "voted",
        type: "bool"
    }, {
        name: "vote",
        type: "uint256"
    }, {
        name: "blindedVote",
        type: "bytes32"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "countVotes",
    outputs: [{
        name: "winningCandidate",
        type: "uint256"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "electionStart",
    outputs: [{
        name: "",
        type: "uint256"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "electionEnd",
    outputs: [{
        name: "",
        type: "uint256"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "chairPerson",
    outputs: [{
        name: "",
        type: "address"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "winnerName",
    outputs: [{
        name: "winnerName",
        type: "bytes32"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "_blindedVote",
        type: "bytes32"
    }],
    name: "blindVote",
    outputs: [],
    payable: false,
    type: "function"
}, {
    inputs: [{
        name: "candidateNames",
        type: "bytes32[]"
    }, {
        name: "electionDuration",
        type: "uint256"
    }],
    payable: false,
    type: "constructor"
}];

var blindElection = web3.eth.contract(blindElectionABI).at(blindElectionAddress);