angular.module('angelWallet').controller('RecordTransactionController', [
    '$scope',
    '$location',
    'aWallet',
    function($scope, $location, aWallet){

        /**
         * @ngdoc property
         * @name transaction
         * @type {object}
         */
        $scope.transaction = {};

        /**
         * @ngdoc method
         * @name save
         *
         * @description
         * Saves transaction and returns to transaction log
         */
        $scope.save = function save(){
            $scope.transaction.date = Math.round(Date.now()/1000);

            if($location.search('type') === 'pay'){
                $scope.transaction.amount = '-' + $scope.transaction.amount;
            }

            aWallet.saveTransaction($scope.transaction);

            $location.path('/');
        };

        /**
         * @ngdoc method
         * @name cancel
         *
         * @description
         * Return to transaction log
         */
        $scope.cancel = function cancel(){
            $location.url('/');
        };
    }
]);