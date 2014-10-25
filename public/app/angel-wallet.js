angular.module('angelWallet', ['ngRoute', 'ui.bootstrap', 'components.navigation']);
angular.module('components.navigation', []);
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
angular.module('angelWallet').controller('WalletController', [
    '$scope',
    function($scope){

    }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvd2FsbGV0LWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFuZ2VsLXdhbGxldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcsIFsnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAnY29tcG9uZW50cy5uYXZpZ2F0aW9uJ10pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicpLmNvbnRyb2xsZXIoJ05hdmlnYXRpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0IHRoZSBkYXRhIGluIHN0b3JhZ2UgYW5kIHJlZnJlc2ggdGhlIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCl7XG5cbiAgICAgICAgfVxuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmNvbnRyb2xsZXIoJ1dhbGxldENvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlKXtcblxuICAgIH1cbl0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==