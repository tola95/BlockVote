/**
 * Created by OmotolaBabasola1 on 12/06/2017.
 */

var Authority = artifacts.require("./Authority.sol");
var Administrator = artifacts.require("./Administrator.sol");

contract('Authority', function(){
    it("verifies Zero Knowledge Proofs correctly", function() {
        return Authority.deployed().then(function(instance) {
            return instance.verifyZKP.call(85, 25, 11, 83, 48, 62, 41, -19, 17, 1024, 22);
        }).then(function(result) {
            assert.equal(result.valueOf(), true, "Correct ZKP did not evaluate to true");
        })
    });
});
