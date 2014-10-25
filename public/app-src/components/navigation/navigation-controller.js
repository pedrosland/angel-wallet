/**
 * @ngdoc controller
 * @name components.navigation:NavigationController
 *
 * @requires $sessionStorage
 * @requires aWCurrency
 * @requires aWallet
 *
 * @description
 * Attach to a link (<a>) and it will update parent element with "active" class
 * if the href of the link matches the current route. Note that this probably
 * won't work with HTML5 routing.
 */
angular.module('components.navigation').controller('NavigationController', [
    '$scope',
    '$location',
    '$window',
    '$timeout',
    '$rootScope',
    '$sessionStorage',
    'aWCurrency',
    'aWallet',
    function($scope, $location, $window, $timeout, $rootScope, $sessionStorage, aWCurrency, aWallet){

        /**
         * @ngdoc property
         * @name isCollapsed
         * @type {boolean}
         *
         * @description
         * Set to `true` if the menu is collapsed
         */
        $scope.isCollapsed = true;

        /**
         * @ngdoc property
         * @name balance
         * @type {number}
         *
         * @description
         * The balance in the user's wallet
         */
        $scope.balance = aWallet.getBalance();

        /**
         * @ngdoc method
         * @name reset
         *
         * @description
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){
            $sessionStorage.$reset();

            // ngStorage doesn't reset immediately so wait until it does (a timeout of 100ms)
            $timeout(function() {
                $window.location.href = '#';
                $window.location.reload();
            }, 150);
        };

        /**
         * @ngdoc method
         * @name getCurrencyClass
         *
         * @description
         * Get current FontAwesome class to use for menu
         */
        $scope.getCurrencyClass = function getCurrencyClass(){
            return 'fa-' + aWCurrency.getCurrency().toLowerCase();
        };

        $rootScope.$on('transaction.add', function(){
            $scope.balance = aWallet.getBalance();
        });
    }
]);