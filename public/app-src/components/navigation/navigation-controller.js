/**
 * @ngdoc controller
 * @name components.navigation:NavigationController
 *
 * @requires aWCurrency
 *
 * @description
 * Attach to a link (<a>) and it will update parent element with "active" class
 * if the href of the link matches the current route. Note that this probably
 * won't work with HTML5 routing.
 */
angular.module('components.navigation').controller('NavigationController', [
    '$scope',
    '$location',
    '$localStorage',
    'aWCurrency',
    function($scope, $location, $localStorage, aWCurrency){

        /**
         * @ngdoc property
         * @name isCollapsed
         *
         * @description
         * Set to `true` if the menu is collapsed
         */
        $scope.isCollapsed = true;

        /**
         * @ngdoc method
         * @name reset
         *
         * @description
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){
            $localStorage.$reset();
            $location.href('/');
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
        }
    }
]);