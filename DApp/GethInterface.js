/**
 * Created by OmotolaBabasola1 on 24/04/2017.
 */

var Web3 = require('web3');

//Create new Web3
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

console.log(web3.eth.defaultAccount);

var tryElGamalABI = [{
    constant: false,
    inputs: [],
    name: "tally",
    outputs: [{
        name: "",
        type: "int256"
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
        type: "uint256"
    }],
    name: "commitments",
    outputs: [{
        name: "a",
        type: "int256"
    }, {
        name: "b",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "a",
        type: "int256"
    }, {
        name: "b",
        type: "int256"
    }],
    name: "sendCommitment",
    outputs: [],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "",
        type: "int256"
    }],
    name: "logTable",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "G",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "H",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "base",
        type: "int256"
    }, {
        name: "exponent",
        type: "int256"
    }, {
        name: "modulus",
        type: "int256"
    }],
    name: "mpmod",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "a",
        type: "int256"
    }, {
        name: "b",
        type: "int256"
    }, {
        name: "s",
        type: "int256"
    }],
    name: "revealCommitment",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "P",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "a",
        type: "int256"
    }],
    name: "logG",
    outputs: [{
        name: "",
        type: "int256"
    }],
    payable: false,
    type: "function"
}, {
    inputs: [{
        name: "_P",
        type: "int256"
    }, {
        name: "_G",
        type: "int256"
    }, {
        name: "_H",
        type: "int256"
    }],
    payable: false,
    type: "constructor"
}];
var tryElGamalAddress = "0xdb0590eb105b583bd1650e7accaddd3b11e97489";
var tryElGamal = web3.eth.contract(tryElGamalABI).at(tryElGamalAddress);

$(function() {
    $("#voteForm").on('submit', function(e) {
        e.preventDefault();
        var candidates;
        var vote;
        var params;
        var commitment;
        $.get( "/candidates/", function( data ) {
            candidates = data
            console.log(candidates);
            var candidate = $('#candidate').val();
            console.log(candidate);
            for (var i=0; i<candidates.length; i++) {
                if (candidate === candidates[i].name) {
                    vote = candidates[i].id;
                }
            }
            $.get("/params", function(data) {
                params = data;
                console.log(params);
                var random = 52;
                commitment = generateElGamalCommitment(vote, random, params.P, params.G, params.H);
                console.log(commitment);
                tryElGamal.sendCommitment(commitment.a, commitment.b);
            });


        });
    });
});

//Currently additive elGamal (G^r, G^m * H^r)
function generateElGamalCommitment (candidate_id, random, P, G, H) {
    var generateMessage = 'generating commitment for candidate ';
    console.log(generateMessage.concat(candidate_id));
    var commitment = {a:0, b:0};
    commitment.a = mpmod(G, random, P);
    commitment.b = mpmod(mpmod(G, candidate_id, P) * mpmod(H, random, P), 1, P);
    return commitment;
};


function mpmod(base, exponent, modulus) {
    if ((base < 1) || (modulus < 1)) {
        return("invalid");
    }
    if (exponent < 0) {
        while (exponent < 0) {
            exponent += ((modulus - 1)/2);
        }
    }
    result = 1;
    while (exponent > 0) {
        if ((exponent % 2) == 1) {
            result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exponent = Math.floor(exponent / 2);
    }
    return (result);
}
/*
function revealCommitment(a, b, s) {
    var As = mpmod(a, -s, P);
    console.log(As);
    var gm = mpmod(mpmod(b,1,P) * As, 1, P);
    console.log(gm);
    return logs[gm];
}

var logs = {
    1 : 0,
    34 : 1,
    86 : 2,
    35 : 3,
    13 : 4,
    14 : 5,
    48 : 6,
    27 : 7,
    62 : 8,
    75 : 9,
    89 : 10,
    30 : 11,
    57 : 12,
    12 : 13,
    87 : 14,
    69 : 15,
    99 : 16,
    49 : 17,
    61 : 18,
    41 : 19,
    3 : 20,
    102 : 21,
    44 : 22,
    105 : 23,
    39 : 24,
    42 : 25,
    37 : 26,
    81 : 27,
    79 : 28,
    11 : 29,
    53 : 30,
    90 : 31,
    64 : 32,
    36 : 33,
    47 : 34,
    100 : 35,
    83 : 36,
    40 : 37,
    76 : 38,
    16 : 39,
    9 : 40,
    92 : 41,
    25 : 42,
    101 : 43,
    10 : 44,
    19 : 45,
    4 : 46,
    29 : 47,
    23 : 48,
    33 : 49,
    52 : 50,
    56 : 51,
    85 : 52
};
*/
