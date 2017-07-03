/**
 * Created by OmotolaBabasola1 on 01/07/2017.
 */

//Set the default account to one of the testrpc-provided accounts
web3.eth.defaultAccount = web3.eth.accounts[0];

//Create wrapper object fot Administrator and then get list of registered Authorities
var administrator;Administrator.deployed().then(function(instance) {administrator = instance;return administrator.getRegisteredAuthorities.call();});

//Create wrapper objects for Authorities and request authority status for each of them
var authority;Authority.deployed().then(function(instance) {authority = instance; return authority.requestAuthorityStatus(); });
var authority2;Authority2.deployed().then(function(instance) {authority2 = instance; return authority2.requestAuthorityStatus(); });
var authority3;Authority3.deployed().then(function(instance) {authority3 = instance; return authority3.requestAuthorityStatus(); });

//Create wrapper for bulletin board.
var bulletinBoard; BulletinBoard.deployed().then(function(instance){bulletinBoard = instance;});

//Get list of registered Authorities. This should return the addresses of the three Authority contracts
administrator.getRegisteredAuthorities.call();

//Set configurations for each of the authorities and link them to the bulletin board
authority.setConfigs();
authority.setBulletinBoard(bulletinBoard.address);
authority2.setConfigs();
authority2.setBulletinBoard(bulletinBoard.address);
authority3.setConfigs();
authority3.setBulletinBoard(bulletinBoard.address);

//Ensure that the first authority has set it's parameters
authority.getG.call();

//Ensure that the first authority has a secret different from the Administrator's
authority.getSecret.call();

//Register the voter with id 1
administrator.register(1);

//Ensure that the voter gets back an id for an authority. In this case the authority id should be 1
administrator.register.call(1);

//Vote as voter with id 1. The parameters are hard coded legitimate values that pass the Zero Knowledge Proof for a vote of "1"
authority.vote(85, 25, 11, 83, 48, 62, 41, -19, 17, 1024, 22);
authority.vote.call(85, 25, 11, 83, 48, 62, 41, -19, 17, 1024, 22);

//Exchange shares between all Authorities
authority.sendShare(authority2.address, authority3.address);
authority2.sendShare(authority.address, authority3.address);
authority3.sendShare(authority.address, authority2.address);

//Retrieve sum of votes cast from the Bulletin Board
authority.setCommitment(authority2.address, authority3.address);
authority2.setCommitment(authority.address, authority3.address);
authority3.setCommitment(authority.address, authority2.address);

//Generate the parameters necessary to reveal the sum of the election
authority2.generateSecret.call();

//Reveal the sum of the election
authority2.revealSum.call();

//Voter Side Functions
function createZKPForCommitment(m, alpha, G, H, P) {
    var Q = (P - 1)/2;
    var w = generateRandomNumber(0, Q-1);
    var r = generateRandomNumber(0, Q-1);
    var d = generateRandomNumber(0, Q-1);

    var commitment = generateElGamalCommitment(m, alpha, P, G, H);
    var alphas = generateAlphas(m, commitment.a, G, P, d, r, w);
    var betas = generateBetas(m, commitment.b, G, H, P, d, r, w);

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

    return proof
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

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
            exponent = parseInt(exponent) + parseInt((modulus - 1)/2);
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