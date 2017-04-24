var express = require('express');
var app = express();
var Web3 = require('web3');
var fs = require('fs');

app.use(express.static("DApp"));

//Read BVConfigs file into memory
var BVConfigs = JSON.parse(fs.readFileSync('BVConfigs', 'utf8'));

//Create new Web3
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

//retrieve contract from blockchain
var voterBoardABI = [{
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
    type: "uint256"
  }],
  name: "voterList",
  outputs: [{
    name: "",
    type: "bytes32"
  }],
  payable: false,
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "voter",
    type: "bytes32"
  }],
  name: "verifyRegistered",
  outputs: [{
    name: "",
    type: "bool"
  }],
  payable: false,
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "voter",
    type: "bytes32"
  }],
  name: "register",
  outputs: [],
  payable: false,
  type: "function"
}, {
  inputs: [{
    name: "_noOfVoters",
    type: "uint8"
  }],
  payable: true,
  type: "constructor"
}];
var voterBoardAddress = "0x883961074c6381e1f4618f12ac06dc5b9804f425";
var voterBoard = web3.eth.contract(voterBoardABI).at(voterBoardAddress);

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

app.get('/', function (req, res) {
  res.send(index.html);
});

app.get('/candidates', function (req, res) {
  res.send(BVConfigs.candidates)
});

/*
//Improve this later on to use name as well
app.get('/checkin/:ssn/', function (req, res) {
  var ssn = req.params.ssn;

  for (var i=0; i<BVConfigs.voters.length; i++) {
    var voterInfo = BVConfigs.voters[i];
    if (voterInfo.id == ssn) {
      var privateKey = randomInt(0, 999999);
      res.send(privateKey);
    }
  }
  res.send("You are not eligible to vote in this election");
});


//Incomplete
app.get('/register/:publicKey/:ssn', function (req, res) {
  var ssn = req.params.ssn;
  var publicKey = req.params.publicKey;

  for (var i=0; i<BVConfigs.voters.length; i++) {
    var voterInfo = BVConfigs.voters[i];
    if (voterInfo.id == ssn) {
      voterInfo.registered = true;
      voterBoard.register(publicKey);

      var verifyCode = voterBoard.verifyRegistered(publicKey);

      break;
    }
  }
  res.send("You are not eligible to vote in this election");
});
 */

app.get('/vote/:candidate', function (req, res) {
  var candidate = req.params.candidate;

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  console.log(BVConfigs.name);
});

//Random Number Generator
function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
