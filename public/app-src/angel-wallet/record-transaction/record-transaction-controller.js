angular.module('angelWallet').controller('RecordTransactionController', [
    '$scope',
    '$rootScope',
    '$location',
    'aWallet',
    function($scope, $rootScope, $location, aWallet){

        /**
         * @ngdoc property
         * @name depositType
         * @type {string}
         */
        $scope.depositType = $location.search().type;

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

            if($scope.depositType === 'pay'){
                $scope.transaction.amount = $scope.transaction.amount * -1;
            }

            aWallet.saveTransaction($scope.transaction);

            $location.url('/');
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

        var unbind = $rootScope.$on('$routeUpdate', function(){
            $scope.depositType = $location.search().type;
        });

        $scope.$on('$destroy', function(){
            unbind();
        });
    }
]);