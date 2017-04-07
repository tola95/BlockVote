/**
 * Created by OmotolaBabasola1 on 07/04/2017.
 */
angular.module('BVMain', [])

.controller('home', function($scope, $http) {
        $http.get('/candidates/').then(function(data) {
            $scope.candidates = data.data;
        })

    $scope.submit = function() {
        $http.get('/vote/' + $scope.candidate).then(function (data) {

        })
    }
 });