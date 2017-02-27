/**
 * Created by OmotolaBabasola1 on 22/02/2017.
 */
angular.module('BVMain', [])

.controller('home', function($scope, $http) {
    $http.get('/candidates/').then(function(data) {
        $scope.candidates = data.data;
    })
})

.controller('registration', function($scope, $http) {
    $scope.submit = function() {
        var id = $scope.id
        $http.get('/register/' + id).then(function(data) {
            if (data.data > 0) {
                $scope.privateKey = data.data;
            } else {
                $scope.privateKey = "";
            }
        })
    }

})