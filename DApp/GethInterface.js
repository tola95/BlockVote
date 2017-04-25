/**
 * Created by OmotolaBabasola1 on 24/04/2017.
 */
var Web3 = require('web3');

//Create new Web3
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

console.log(web3.eth.defaultAccount);

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

$(function() {
    $("#voteForm").on('submit', function(e) {
        e.preventDefault();
        var candidate = $('#candidate').val();
        console.log(candidate);
        election.vote(candidate);
    });
});
