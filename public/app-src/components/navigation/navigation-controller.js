angular.module('components.navigation').controller('NavigationController', [
    '$scope',
    function($scope){
        $scope.isCollapsed = true;

        /**
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){

        }
    }
]);