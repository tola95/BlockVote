/**
 * Created by OmotolaBabasola1 on 04/03/2017.
 */

var greeterSource = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) suicide(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';

var greeterCompiled = web3.eth.compile.solidity(greeterSource);

var _greeting = "Hello World!";

var greeterContract = web3.eth.contract(greeterCompiled["<stdin>:greeter"].info.abiDefinition);

var greeter = greeterContract.new(_greeting,{from:web3.eth.accounts[0], data: greeterCompiled["<stdin>:greeter"].code, gas: 300000}, function(e, contract){
    if(e) {

        if(!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

        } else {
            console.log("Contract mined! Address: " + contract.address);
            console.log(contract);
        }

    }
});

//To let index.js work with geth console use
//admin.startRPC("127.0.0.1", 8545, "*", "web3,db,net,eth")

var voterBoardSource = 'contract mortal { /* Define variable owner of the type address*/ address owner; /* this function is executed at initialization and sets the owner of the contract */ function mortal() { owner = msg.sender; } /* Function to recover the funds on the contract */ function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract voterBoard is mortal { /* Number of voters */ uint8 noOfVoters; /* List of voters */ bytes32[] public voterList; function voterBoard(uint8 _noOfVoters) payable public { noOfVoters = _noOfVoters; voterList = new bytes32[](noOfVoters); } function register(bytes32 voter) { voterList.push(voter); } function verifyRegistered(bytes32 voter) returns (bool) { for(uint8 i = 0; i < voterList.length; i++) { if (voterList[i] == voter) { return true; } } return false; } }';

var voterBoardCompiled = web3.eth.compile.solidity(voterBoardSource);

var _noOfVoters = 32;

var voterBoardContract = web3.eth.contract(voterBoardCompiled["<stdin>:voterBoard"].info.abiDefinition);

var voterBoard = voterBoardContract.new(_noOfVoters,{from:web3.eth.accounts[0], data: voterBoardCompiled["<stdin>:voterBoard"].code, gas: 400000}, function(e, contract){
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

//address -> 0x9a7cb41136adedf80c30e59e98f4bf99808d5010
/* abiDef -> [{
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
 payable: false,
 type: "constructor"
 }]
 */
