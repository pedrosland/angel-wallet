angular.module('angelWallet', ['ngRoute', 'ui.bootstrap', 'components.navigation', 'components.navLink'])
    .config([
        '$routeProvider',
        function($routeProvider){
            $routeProvider
                .when('/', {
                    controller: 'LogsController',
                    // This should be converted to JS and injected in
                    templateUrl: '/app-src/angel-wallet/logs/logs.html'
                })
                .when('/pay', {
                    redirectTo: '/record?type=pay'
                })
                .when('/deposit', {
                    redirectTo: '/record?type=deposit'
                })
                .when('/record', {
                    controller: 'RecordTransactionController',
                    templateUrl: '/app-src/angel-wallet/record-transaction/record-transaction.html',
                    reloadOnSearch: false
                })
                .otherwise('/');
        }
    ]);
angular.module('components.navLink', []);
angular.module('components.navigation', []);
/**
 * @ngdoc controller
 * @name components.navigation:NavigationController
 *
 * @description
 * Attach to a link (<a>) and it will update parent element with "active" class
 * if the href of the link matches the current route. Note that this probably
 * won't work with HTML5 routing.
 */
angular.module('components.navigation').controller('NavigationController', [
    '$scope',
    function($scope){
        $scope.isCollapsed = true;

        /**
         * @ngdoc method
         * @name components.navigation#reset
         *
         * @description
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){

        }
    }
]);
/**
 * @ngdoc directive
 * @name waNavLink
 * @restrict A
 *
 * @requires $rootScope
 * @requires $location
 *
 * @description
 * Attach to a link (<a>) and it will update parent element with "active" class
 * if the href of the link matches the current route. Note that this probably
 * won't work with HTML5 routing.
 */
angular.module('components.navLink').directive('waNavLink', [
    '$rootScope',
    '$location',
    function($rootScope, $location){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var active = false;

                function routeChangeListener(){
                    if(attrs.href === '#' + $location.url()){
                        active = true;
                        element.parent().addClass('active');
                    }else if(active){
                        element.parent().removeClass('active');
                    }
                }

                var unbind = $rootScope.$on('$locationChangeStart', routeChangeListener);

                scope.$on('$destroy', function(){
                    unbind();
                });
            }
        }
    }
]);
angular.module('angelWallet').controller('WalletController', [
    '$scope',
    function($scope){

    }
]);
angular.module('angelWallet').controller('RecordTransactionController', [
    '$scope',
    '$location',
    function($scope, $location){
        $scope.transaction = {};

        $scope.save = function save(){
            $scope.transaction.date = Date.now();

            if($location.search('type') === 'pay'){
                $scope.transaction.amount = '-' + $scope.transaction.amount;
            }

            console.log($scope.transaction);

            $location.path('/');
        };

        $scope.cancel = function cancel(){
            $location.path('/');
        }
    }
]);
angular.module('angelWallet').controller('LogsController', [
    '$scope',
    function($scope){
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
        ]
    }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL25hdi1saW5rL25hdi1saW5rLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uanMiLCJjb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi1jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay1kaXJlY3RpdmUuanMiLCJhbmdlbC13YWxsZXQvd2FsbGV0LWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvcmVjb3JkLXRyYW5zYWN0aW9uL3JlY29yZC10cmFuc2FjdGlvbi1jb250cm9sbGVyLmpzIiwiYW5nZWwtd2FsbGV0L2xvZ3MvbG9ncy1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYW5nZWwtd2FsbGV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JywgWyduZ1JvdXRlJywgJ3VpLmJvb3RzdHJhcCcsICdjb21wb25lbnRzLm5hdmlnYXRpb24nLCAnY29tcG9uZW50cy5uYXZMaW5rJ10pXG4gICAgLmNvbmZpZyhbXG4gICAgICAgICckcm91dGVQcm92aWRlcicsXG4gICAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dzQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGNvbnZlcnRlZCB0byBKUyBhbmQgaW5qZWN0ZWQgaW5cbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwLXNyYy9hbmdlbC13YWxsZXQvbG9ncy9sb2dzLmh0bWwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL3BheScsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9yZWNvcmQ/dHlwZT1wYXknXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL2RlcG9zaXQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvcmVjb3JkP3R5cGU9ZGVwb3NpdCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvcmVjb3JkJywge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVjb3JkVHJhbnNhY3Rpb25Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwLXNyYy9hbmdlbC13YWxsZXQvcmVjb3JkLXRyYW5zYWN0aW9uL3JlY29yZC10cmFuc2FjdGlvbi5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG4gICAgICAgIH1cbiAgICBdKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZMaW5rJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nLCBbXSk7IiwiLyoqXG4gKiBAbmdkb2MgY29udHJvbGxlclxuICogQG5hbWUgY29tcG9uZW50cy5uYXZpZ2F0aW9uOk5hdmlnYXRpb25Db250cm9sbGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBdHRhY2ggdG8gYSBsaW5rICg8YT4pIGFuZCBpdCB3aWxsIHVwZGF0ZSBwYXJlbnQgZWxlbWVudCB3aXRoIFwiYWN0aXZlXCIgY2xhc3NcbiAqIGlmIHRoZSBocmVmIG9mIHRoZSBsaW5rIG1hdGNoZXMgdGhlIGN1cnJlbnQgcm91dGUuIE5vdGUgdGhhdCB0aGlzIHByb2JhYmx5XG4gKiB3b24ndCB3b3JrIHdpdGggSFRNTDUgcm91dGluZy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicpLmNvbnRyb2xsZXIoJ05hdmlnYXRpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgY29tcG9uZW50cy5uYXZpZ2F0aW9uI3Jlc2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBSZXNldCB0aGUgZGF0YSBpbiBzdG9yYWdlIGFuZCByZWZyZXNoIHRoZSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpe1xuXG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHdhTmF2TGlua1xuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICogQHJlcXVpcmVzICRsb2NhdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnKS5kaXJlY3RpdmUoJ3dhTmF2TGluaycsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJvdXRlQ2hhbmdlTGlzdGVuZXIoKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXR0cnMuaHJlZiA9PT0gJyMnICsgJGxvY2F0aW9uLnVybCgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoYWN0aXZlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHVuYmluZCA9ICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIHJvdXRlQ2hhbmdlTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHVuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignV2FsbGV0Q29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUpe1xuXG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignUmVjb3JkVHJhbnNhY3Rpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uKXtcbiAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0ge307XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCl7XG4gICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgIGlmKCRsb2NhdGlvbi5zZWFyY2goJ3R5cGUnKSA9PT0gJ3BheScpe1xuICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5hbW91bnQgPSAnLScgKyAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKXtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdMb2dzQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAkc2NvcGUubG9ncyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgICBhbW91bnQ6ICc1LjIwJyxcbiAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpIC0gMzAwMDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEaW5uZXInLFxuICAgICAgICAgICAgICAgIGFtb3VudDogJzE1LjgwJyxcbiAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9XG5dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=