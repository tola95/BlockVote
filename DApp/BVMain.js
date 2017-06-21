/**
 * Created by OmotolaBabasola1 on 07/04/2017.
 */
var BVMain = angular.module('BVMain', []);

BVMain.factory('TimeService', function() {
    return {
        registrationTimeOver: true,
        tallyTimeBegan: false
    };
});

BVMain.controller('home', function($scope, $http, TimeService) {
    $scope.registrationTimeOver = TimeService.registrationTimeOver;
    $scope.tallyTimeBegan = TimeService.tallyTimeBegan;

    $http.get('/candidates/').then(function(data) {
        $scope.candidates = data.data;
    });

    $http.get('/title/').then(function(data) {
        $scope.title = data.data;
    });

 });

BVMain.controller('register', function($scope, $http, TimeService) {
    $scope.registrationTimeOver = TimeService.registrationTimeOver;
    $scope.tallyTimeBegan = TimeService.tallyTimeBegan;

    $http.get('/title/').then(function(data) {
        $scope.title = data.data;
    });
});

BVMain.controller('tally', function($scope, $http, TimeService) {
    $scope.registrationTimeOver = TimeService.registrationTimeOver;
    $scope.tallyTimeBegan = TimeService.tallyTimeBegan;

    $http.get('/candidates/').then(function(data) {
        $scope.candidates = data.data;
    });

    $http.get('/title/').then(function(data) {
        $scope.title = data.data;
    });
});