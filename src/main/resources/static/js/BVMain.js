/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
angular.module('BVMain', [])

.controller('home', function($scope, $http) {
    $http.get('/candidates/').then(function(data) {
        $scope.candidates = data.data;
    })
})