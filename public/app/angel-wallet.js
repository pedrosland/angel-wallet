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
angular.module('components.currency').filter('currencyCodeToSymbol', [
    'currencySymbolMapping',
    function(currencySymbolMapping) {
        return function(code) {
            return currencySymbolMapping[code];
        }
    }
]);
/**
 * @ngdoc service
 * @name aWCurrency
 *
 * @requires $rootScope
 *
 * @description
 * Service to get/set the user's currency preference.
 */
angular.module('components.currency').factory('aWCurrency', [
    '$rootScope',
    function($rootScope){
        // Set since we don't yet have a persistence layer
        $rootScope.currency = 'GBP';

        return {
            /**
             * @ngdoc method
             * @name components.currency.aWCurrency#setCurrency
             * @param currency {string} 3-character currency code
             *
             * @description
             * Persists currency code and sets it on $rootScope
             */
            setCurrency: function setCurrency(currency){
                // Using $rootScope as it will be included throughout the entire app.
                $rootScope.currency = currency;
            },
            /**
             * @ngdoc method
             * @name components.currency.aWCurrency#getCurrency
             *
             * @description
             * Gets the user's currency code for their wallet
             */
            getCurrency: function getCurrency(){
                return $rootScope.currency;
            }
        }
    }
]);
/**
 * @ngdoc constant
 * @name currencySymbolMapping
 *
 * @description
 * Object of 3-character currency codes mapping to currency symbols.
 */
angular.module('components.currency').constant('currencySymbolMapping', {
    GBP: '£',
    EUR: '€',
    USD: '$'
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3JlY29yZC10cmFuc2FjdGlvbi9yZWNvcmQtdHJhbnNhY3Rpb24tY29udHJvbGxlci5qcyIsImFuZ2VsLXdhbGxldC9sb2dzL2xvZ3MtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYW5nZWwtd2FsbGV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JywgWyduZ1JvdXRlJywgJ3VpLmJvb3RzdHJhcCcsICdjb21wb25lbnRzLm5hdmlnYXRpb24nLCAnY29tcG9uZW50cy5uYXZMaW5rJywgJ2NvbXBvbmVudHMuY3VycmVuY3knXSlcbiAgICAuY29uZmlnKFtcbiAgICAgICAgJyRyb3V0ZVByb3ZpZGVyJyxcbiAgICAgICAgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ3NDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgY29udmVydGVkIHRvIEpTIGFuZCBpbmplY3RlZCBpblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9sb2dzL2xvZ3MuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvcGF5Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPXBheSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvZGVwb3NpdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9yZWNvcmQ/dHlwZT1kZXBvc2l0J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9yZWNvcmQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbiAgICAgICAgfVxuICAgIF0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsIFtdKTsiLCIvKipcbiAqIEBuZ2RvYyBjb250cm9sbGVyXG4gKiBAbmFtZSBjb21wb25lbnRzLm5hdmlnYXRpb246TmF2aWdhdGlvbkNvbnRyb2xsZXJcbiAqXG4gKiBAcmVxdWlyZXMgYVdDdXJyZW5jeVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nKS5jb250cm9sbGVyKCdOYXZpZ2F0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSBjb21wb25lbnRzLm5hdmlnYXRpb24uTmF2aWdhdGlvbkNvbnRyb2xsZXIjcmVzZXRcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJlc2V0IHRoZSBkYXRhIGluIHN0b3JhZ2UgYW5kIHJlZnJlc2ggdGhlIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCl7XG5cbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHdhTmF2TGlua1xuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICogQHJlcXVpcmVzICRsb2NhdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnKS5kaXJlY3RpdmUoJ3dhTmF2TGluaycsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJvdXRlQ2hhbmdlTGlzdGVuZXIoKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXR0cnMuaHJlZiA9PT0gJyMnICsgJGxvY2F0aW9uLnVybCgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoYWN0aXZlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHVuYmluZCA9ICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIHJvdXRlQ2hhbmdlTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHVuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knKS5maWx0ZXIoJ2N1cnJlbmN5Q29kZVRvU3ltYm9sJywgW1xuICAgICdjdXJyZW5jeVN5bWJvbE1hcHBpbmcnLFxuICAgIGZ1bmN0aW9uKGN1cnJlbmN5U3ltYm9sTWFwcGluZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbmN5U3ltYm9sTWFwcGluZ1tjb2RlXTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lIGFXQ3VycmVuY3lcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZSB0byBnZXQvc2V0IHRoZSB1c2VyJ3MgY3VycmVuY3kgcHJlZmVyZW5jZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knKS5mYWN0b3J5KCdhV0N1cnJlbmN5JywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlKXtcbiAgICAgICAgLy8gU2V0IHNpbmNlIHdlIGRvbid0IHlldCBoYXZlIGEgcGVyc2lzdGVuY2UgbGF5ZXJcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW5jeSA9ICdHQlAnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMuY3VycmVuY3kuYVdDdXJyZW5jeSNzZXRDdXJyZW5jeVxuICAgICAgICAgICAgICogQHBhcmFtIGN1cnJlbmN5IHtzdHJpbmd9IDMtY2hhcmFjdGVyIGN1cnJlbmN5IGNvZGVcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIFBlcnNpc3RzIGN1cnJlbmN5IGNvZGUgYW5kIHNldHMgaXQgb24gJHJvb3RTY29wZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXRDdXJyZW5jeTogZnVuY3Rpb24gc2V0Q3VycmVuY3koY3VycmVuY3kpe1xuICAgICAgICAgICAgICAgIC8vIFVzaW5nICRyb290U2NvcGUgYXMgaXQgd2lsbCBiZSBpbmNsdWRlZCB0aHJvdWdob3V0IHRoZSBlbnRpcmUgYXBwLlxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVuY3kgPSBjdXJyZW5jeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMuY3VycmVuY3kuYVdDdXJyZW5jeSNnZXRDdXJyZW5jeVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogR2V0cyB0aGUgdXNlcidzIGN1cnJlbmN5IGNvZGUgZm9yIHRoZWlyIHdhbGxldFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRDdXJyZW5jeTogZnVuY3Rpb24gZ2V0Q3VycmVuY3koKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5jdXJyZW5jeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIGNvbnN0YW50XG4gKiBAbmFtZSBjdXJyZW5jeVN5bWJvbE1hcHBpbmdcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE9iamVjdCBvZiAzLWNoYXJhY3RlciBjdXJyZW5jeSBjb2RlcyBtYXBwaW5nIHRvIGN1cnJlbmN5IHN5bWJvbHMuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuY29uc3RhbnQoJ2N1cnJlbmN5U3ltYm9sTWFwcGluZycsIHtcbiAgICBHQlA6ICfCoycsXG4gICAgRVVSOiAn4oKsJyxcbiAgICBVU0Q6ICckJ1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignUmVjb3JkVHJhbnNhY3Rpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uKXtcbiAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0ge307XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCl7XG4gICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgIGlmKCRsb2NhdGlvbi5zZWFyY2goJ3R5cGUnKSA9PT0gJ3BheScpe1xuICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5hbW91bnQgPSAnLScgKyAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKXtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdMb2dzQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBhV0N1cnJlbmN5KXtcbiAgICAgICAgJHNjb3BlLnNldEN1cnJlbmN5ID0gYVdDdXJyZW5jeS5zZXRDdXJyZW5jeTtcblxuICAgICAgICAkc2NvcGUubG9ncyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgICBhbW91bnQ6ICc1LjIwJyxcbiAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpIC0gMzAwMDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEaW5uZXInLFxuICAgICAgICAgICAgICAgIGFtb3VudDogJzE1LjgwJyxcbiAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9