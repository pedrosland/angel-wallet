angular.module('angelWallet').controller('LogsController', [
    '$scope',
    'aWCurrency',
    'aWallet',
    function($scope, aWCurrency, aWallet){
        $scope.setCurrency = aWCurrency.setCurrency;

        $scope.logs = aWallet.getTransactions();
    }
]);