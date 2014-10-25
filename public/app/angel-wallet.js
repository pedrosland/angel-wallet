angular.module('angelWallet', ['ngRoute', 'ui.bootstrap', 'components.navigation', 'components.navLink', 'components.currency'])
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
angular.module('components.currency', []);
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
angular.module('components.currency').factory('aWCurrency', [
    '$rootScope',
    function($rootScope){
        // Set since we don't yet have a persistence layer
        $rootScope.currency = 'GBP';

        return {
            setCurrency: function setCurrency(currency){
                // Using $rootScope as it will be included throughout the entire app.
                $rootScope.currency = currency;
            },
            getCurrency: function getCurrency(){
                return $rootScope.currency;
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1zZXJ2aWNlLmpzIiwiYW5nZWwtd2FsbGV0L3JlY29yZC10cmFuc2FjdGlvbi9yZWNvcmQtdHJhbnNhY3Rpb24tY29udHJvbGxlci5qcyIsImFuZ2VsLXdhbGxldC9sb2dzL2xvZ3MtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsICdjb21wb25lbnRzLm5hdkxpbmsnLCAnY29tcG9uZW50cy5jdXJyZW5jeSddKVxuICAgIC5jb25maWcoW1xuICAgICAgICAnJHJvdXRlUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9nc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gSlMgYW5kIGluamVjdGVkIGluXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L2xvZ3MvbG9ncy5odG1sJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9wYXknLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvcmVjb3JkP3R5cGU9cGF5J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9kZXBvc2l0Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPWRlcG9zaXQnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL3JlY29yZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlY29yZFRyYW5zYWN0aW9uQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L3JlY29yZC10cmFuc2FjdGlvbi9yZWNvcmQtdHJhbnNhY3Rpb24uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuICAgICAgICB9XG4gICAgXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2TGluaycsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZpZ2F0aW9uJywgW10pOyIsIi8qKlxuICogQG5nZG9jIGNvbnRyb2xsZXJcbiAqIEBuYW1lIGNvbXBvbmVudHMubmF2aWdhdGlvbjpOYXZpZ2F0aW9uQ29udHJvbGxlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nKS5jb250cm9sbGVyKCdOYXZpZ2F0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMubmF2aWdhdGlvbiNyZXNldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogUmVzZXQgdGhlIGRhdGEgaW4gc3RvcmFnZSBhbmQgcmVmcmVzaCB0aGUgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKXtcblxuICAgICAgICB9XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB3YU5hdkxpbmtcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEF0dGFjaCB0byBhIGxpbmsgKDxhPikgYW5kIGl0IHdpbGwgdXBkYXRlIHBhcmVudCBlbGVtZW50IHdpdGggXCJhY3RpdmVcIiBjbGFzc1xuICogaWYgdGhlIGhyZWYgb2YgdGhlIGxpbmsgbWF0Y2hlcyB0aGUgY3VycmVudCByb3V0ZS4gTm90ZSB0aGF0IHRoaXMgcHJvYmFibHlcbiAqIHdvbid0IHdvcmsgd2l0aCBIVE1MNSByb3V0aW5nLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZMaW5rJykuZGlyZWN0aXZlKCd3YU5hdkxpbmsnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiByb3V0ZUNoYW5nZUxpc3RlbmVyKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGF0dHJzLmhyZWYgPT09ICcjJyArICRsb2NhdGlvbi51cmwoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB1bmJpbmQgPSAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCByb3V0ZUNoYW5nZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB1bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuZmFjdG9yeSgnYVdDdXJyZW5jeScsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSl7XG4gICAgICAgIC8vIFNldCBzaW5jZSB3ZSBkb24ndCB5ZXQgaGF2ZSBhIHBlcnNpc3RlbmNlIGxheWVyXG4gICAgICAgICRyb290U2NvcGUuY3VycmVuY3kgPSAnR0JQJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2V0Q3VycmVuY3k6IGZ1bmN0aW9uIHNldEN1cnJlbmN5KGN1cnJlbmN5KXtcbiAgICAgICAgICAgICAgICAvLyBVc2luZyAkcm9vdFNjb3BlIGFzIGl0IHdpbGwgYmUgaW5jbHVkZWQgdGhyb3VnaG91dCB0aGUgZW50aXJlIGFwcC5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbmN5ID0gY3VycmVuY3k7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q3VycmVuY3k6IGZ1bmN0aW9uIGdldEN1cnJlbmN5KCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRyb290U2NvcGUuY3VycmVuY3k7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pe1xuICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24gPSB7fTtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKXtcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5kYXRlID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgaWYoJGxvY2F0aW9uLnNlYXJjaCgndHlwZScpID09PSAncGF5Jyl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmFtb3VudCA9ICctJyArICRzY29wZS50cmFuc2FjdGlvbi5hbW91bnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50cmFuc2FjdGlvbik7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpe1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmNvbnRyb2xsZXIoJ0xvZ3NDb250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICdhV0N1cnJlbmN5JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIGFXQ3VycmVuY3kpe1xuICAgICAgICAkc2NvcGUuc2V0Q3VycmVuY3kgPSBhV0N1cnJlbmN5LnNldEN1cnJlbmN5O1xuXG4gICAgICAgICRzY29wZS5sb2dzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTHVuY2gnLFxuICAgICAgICAgICAgICAgIGFtb3VudDogJzUuMjAnLFxuICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCkgLSAzMDAwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rpbm5lcicsXG4gICAgICAgICAgICAgICAgYW1vdW50OiAnMTUuODAnLFxuICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG5dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=