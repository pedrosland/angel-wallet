angular.module('angelWallet').controller('RecordTransactionController', [
    '$scope',
    '$location',
    function($scope, $location){

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
            $scope.transaction.date = Date.now();

            if($location.search('type') === 'pay'){
                $scope.transaction.amount = '-' + $scope.transaction.amount;
            }

            console.log($scope.transaction);

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
            $location.path('/');
        };
    }
]);