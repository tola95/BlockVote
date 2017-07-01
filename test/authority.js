/**
 * Created by OmotolaBabasola1 on 12/06/2017.
 */

var Authority = artifacts.require("./Authority.sol");
var Administrator = artifacts.require("./Administrator.sol");

contract('Authority', function(){

    it("reconstructs Shamir Secret correctly", function() {
        return Authority.deployed().then(function(instance) {
            instance.requestAuthorityStatus();
            instance.setConfigs();
            instance.receiveShare(60, 2);
            instance.receiveShare(23, 3);
            return instance.generateSecret.call();
        }).then(function(result) {
            assert.equal(result.valueOf(), 12, "Shamir reconstruction incorrect");
        })
    });

    it("sets configurations correctly", function() {
        return Authority.deployed().then(function(instance) {
            return instance.getG.call();
        }).then(function(result) {
            assert.equal(result.valueOf(), 34, "G was not set correctly");
        })
    });

    it("verifies Zero Knowledge Proofs correctly", function() {
        return Authority.deployed().then(function(instance) {
            return instance.verifyZKP.call(85, 25, 11, 83, 48, 62, 41, -19, 17, 1024, 22);
        }).then(function(result) {
            assert.equal(result.valueOf(), true, "Correct ZKP did not evaluate to true");
        })
    });

    it("calculates finite field modulus correctly", function() {
        return Authority.deployed().then(function(instance) {
            return instance.mpmod.call(34, 2, 107);
        }).then(function(result) {
            assert.equal(result.valueOf(), 86, "Finite field modulus incorrect");
        })
    });

    it("calculates finite field logarithm correctly", function() {
        return Authority.deployed().then(function(instance) {
            return instance.logG.call(86);
        }).then(function(result) {
            assert.equal(result.valueOf(), 2, "Finite field logarithm incorrect");
        })
    });


});
