/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
angular.module('BVMain', [])

.service('sharedData', function() {
    var candidates = [];
    var privateKey = "";

    return {
        getCandidates: function () {
            return candidates;
        },
        setCandidates: function(value) {
            candidates = value;
        },
        getPrivateKey: function() {
            return privateKey;
        },
        setPrivateKey: function(value) {
            privateKey = value;
        }
    };
})

.controller('home', function($scope, $http, sharedData) {
    $scope.candidates = sharedData.getCandidates();
    if ($scope.candidates === "") {
        $http.get('/candidates/').then(function(data) {
            sharedData.setCandidates(data.data);
            $scope.candidates = sharedData.getCandidates();
        })
    }
})

.controller('registration', function($scope, $http, sharedData) {
    $scope.submit = function() {
        var id = $scope.id;
        $http.get('/register/' + id).then(function(data) {
            if (data.data > 0) {
                sharedData.setPrivateKey(data.data);
                $scope.privateKey = sharedData.getPrivateKey();
            } else {
                $scope.privateKey = "";
            }
        })
    }

})

.controller('voting',  function ($scope, $http, sharedData) {
    $scope.vars = {};
    $scope.candidates = sharedData.getCandidates();

    if ($scope.candidates == "") {
        $http.get('/candidates/').then(function(data) {
            sharedData.setCandidates(data.data);
            $scope.candidates = sharedData.getCandidates();
            $scope.vars.id = $scope.candidates[0].name;
        })

    } else {
        $scope.vars.id = $scope.candidates[0].name;
    }

    $scope.submit = function() {
        var votedCandidate = $scope.vars.id;
        $http.get('/vote/' + sharedData.getPrivateKey() + '/' + votedCandidate).then(function (data) {
            $scope.vars.voteMessage = "Thanks for voting. You have voted for " + votedCandidate;
        })
    }

})