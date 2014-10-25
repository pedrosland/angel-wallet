angular.module('angelWallet').controller('RecordTransactionController', [
    '$scope',
    '$location',
    '$routeParams',
    function($scope, $location, $routeParams){
        $scope.transaction = {};

        $scope.save = function save(){
            $scope.transaction.date = Date.now();

            if($routeParams.type === 'pay'){
                $scope.transaction.amount = '-' + $scope.transaction.amount;
            }

            console.log($scope.transaction);

            $location.path('/');
        };
    }
]);