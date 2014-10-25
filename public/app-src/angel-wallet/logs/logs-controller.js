angular.module('angelWallet').controller('LogsController', [
    '$scope',
    'aWCurrency',
    function($scope, aWCurrency){
        $scope.setCurrency = aWCurrency.setCurrency;

        $scope.logs = [
            {
                description: 'Lunch',
                amount: '5.20',
                date: Date.now() - 30000
            },
            {
                description: 'Dinner',
                amount: '15.80',
                date: Date.now()
            }
        ];
    }
]);