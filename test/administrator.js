/**
 * Created by OmotolaBabasola1 on 30/06/2017.
 */

var Administrator = artifacts.require("./Administrator.sol");

var Authority = artifacts.require("./Authority.sol");
var Authority2 = artifacts.require("./Authority2.sol");
var Authority3 = artifacts.require("./Authority3.sol");

contract('Administrator', function(){

    it("sets configurations on instantiation correctly", function() {
        return Administrator.deployed().then(function(instance) {
            return instance.getG.call();
        }).then(function(result) {
            assert.equal(result.valueOf(), 34, "G was not set correctly");
        })
    });

    it("registers no more than the specified number of authorities", function () {
        return Administrator.deployed().then(function(instance) {
            instance.requestAuthorityStatus(Authority.address);
            instance.requestAuthorityStatus(Authority2.address);
            instance.requestAuthorityStatus(Authority3.address);
            return instance.requestAuthorityStatus.call(0x0123456789);
        }).then(function(result) {
            assert.equal(result.valueOf(), false, "More than the specified number of authorities were registered");
        })
    });

    it("shares are generated correctly", function () {
        return Administrator.deployed().then(function(instance) {
            return instance.generateShare.call(2);
        }).then(function(result) {
            assert.equal(result.valueOf(), 60, "Shares are not generated correctly");
        })
    });

    it("legitimate voters can register", function () {
        return Administrator.deployed().then(function(instance) {
            return instance.register.call(2);
        }).then(function(result) {
            assert.equal(result.valueOf(), 2, "legitimate voters cannot register");
        })
    });

    it("non legitimate voters cannot register", function () {
        return Administrator.deployed().then(function(instance) {
            return instance.register.call(4);
        }).then(function(result) {
            assert.equal(result.valueOf(), 0, "non legitimate voters can register");
        })
    });
});
