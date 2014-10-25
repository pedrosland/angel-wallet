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
    'aWCurrency',
    function($scope){
        $scope.isCollapsed = true;

        /**
         * @ngdoc method
         * @name components.navigation.NavigationController#reset
         *
         * @description
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){

        };
    }
]);