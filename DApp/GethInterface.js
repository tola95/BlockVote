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
}


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

function generateAlphas(m, commitment_x, G, P, d, r, w) {
    var alpha = {a:0, b:0};
    if (m == 1) {
        alpha.a = mpmod(mpmod(G, r, P) * mpmod(commitment_x, d, P), 1, P);
        alpha.b = mpmod(G, w, P);
    } else if (m == -1) {
        alpha.a = mpmod(G, w, P);
        alpha.b = mpmod(mpmod(G, r, P) * mpmod(commitment_x, d, P), 1, P);
    } else {
        return("invalid m");
    }
    return (alpha);
}

function generateBetas(m, commitment_y, G, H, P, d, r, w) {
    var beta = {a:0, b:0};
    if (m == 1) {
        beta.a = mpmod(mpmod(H, r, P) * mpmod(commitment_y * mpmod(G, m, P), d, P), 1, P);
        beta.b = mpmod(H, w, P);
    } else if (m == -1) {
        beta.a = mpmod(H, w, P);
        beta.b = mpmod(mpmod(H, r, P) * mpmod(commitment_y * mpmod(G, m, P), d, P), 1, P);
    } else {
        return("invalid m");
    }
    return (beta);
}

function generateD(m, c, d_rand) {
    var d = {a:0, b:0};
    if (m == 1) {
        d.a = d_rand;
        d.b = c - d_rand;
    } else if (m == -1) {
        d.a = c - d_rand;
        d.b = d_rand;
    } else {
        return("invalid m");
    }
    return (d);
}

function generateR(m, w, d, r_rand, alpha) {
    var r = {a:0, b:0};
    if (m == 1) {
        r.a = r_rand;
        r.b = (w - (alpha * d.b));
    } else if (m == -1) {
        r.a = (w - (alpha * d.a));
        r.b = r_rand;
    } else {
        return("invalid m");
    }
    return (r);
}

function createZKPForCommitment(m, alpha, G, H, P) {
    var Q = (P - 1)/2;
    var w = /*27*/generateRandomNumber(0, Q-1);
    var r = /*15*/generateRandomNumber(0, Q-1);
    var d = /*10*/generateRandomNumber(0, Q-1);

    var commitment = generateElGamalCommitment(m, alpha, P, G, H);
    var alphas = generateAlphas(m, commitment.a, G, P, d, r, w);
    var betas = generateBetas(m, commitment.b, G, H, P, d, r, w);

    //var challenge = (web3.sha3(JSON.stringify(commitment))) % Q;
    var challenge = generateRandomNumber(0, Q-1);

    var Ds = generateD(m, challenge, d);
    var Rs = generateR(m, w, Ds, r, alpha);

    var proof = {
        co : commitment,
        a : alphas,
        b : betas,
        d : Ds,
        r : Rs,
        //temporary, to test method. Remove later
        c: challenge
    };
    console.log(proof);

    return proof

}
/*
function verifyProof(proof, G, H, P) {
    //var challenge = (web3.sha3(JSON.stringify(proof.co))) % Q;
    var Q = (P - 1)/2;
    var challenge = proof.c;
    if (challenge != proof.d.a + proof.d.b) {
        return "Ds do not add up";
    }
    var g_r1_x_d1 = mpmod(mpmod(G, proof.r.a, P) * mpmod(proof.co.a, proof.d.a, P), 1, P);
    if (proof.a.a != g_r1_x_d1) {
        return "A1 do not add up";
    }
    var h_r1_yG_d1 = mpmod(mpmod(H, proof.r.a, P) * mpmod(proof.co.b * G, proof.d.a, P), 1, P);
    console.log(proof.b.a);
    console.log(h_r1_yG_d1);
    if (proof.b.a != h_r1_yG_d1) {
        return "B1 do not add up";
    }
    var g_r2_x_d2 = mpmod(mpmod(G, proof.r.b, P) * mpmod(proof.co.a, proof.d.b, P), 1, P);
    console.log(proof.a.b);
    console.log(g_r2_x_d2);
    if (proof.a.b != g_r2_x_d2) {
        return "A2 do not add up";
    }
    var h_r2_yG_d2 = mpmod(mpmod(H, proof.r.b, P) * mpmod(proof.co.b * mpmod(G, -1, P), proof.d.b, P), 1, P);
    console.log(proof.b.b);
    console.log(h_r2_yG_d2);
    if (proof.b.b != h_r2_yG_d2) {
        return "B2 do not add up";
    }
    return true;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

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
