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
    '$location',
    '$localStorage',
    'aWCurrency',
    function($scope, $location, $localStorage, aWCurrency){

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
        };
    }
]);
angular.module('components.currency').filter('currencyCodeToSymbol', [
    'currencySymbolMapping',
    function(currencySymbolMapping) {
        return function(code) {
            return currencySymbolMapping[code];
        };
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
        };
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
angular.module('angelWallet').factory('aWallet', [
    '$localStorage',
    function($localStorage){

    }
]);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3dhbGxldC93YWxsZXQtc2VydmljZS5qcyIsImFuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsICdjb21wb25lbnRzLm5hdkxpbmsnLCAnY29tcG9uZW50cy5jdXJyZW5jeSddKVxuICAgIC5jb25maWcoW1xuICAgICAgICAnJHJvdXRlUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9nc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gSlMgYW5kIGluamVjdGVkIGluXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L2xvZ3MvbG9ncy5odG1sJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9wYXknLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvcmVjb3JkP3R5cGU9cGF5J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9kZXBvc2l0Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPWRlcG9zaXQnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL3JlY29yZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlY29yZFRyYW5zYWN0aW9uQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L3JlY29yZC10cmFuc2FjdGlvbi9yZWNvcmQtdHJhbnNhY3Rpb24uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuICAgICAgICB9XG4gICAgXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2TGluaycsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZpZ2F0aW9uJywgW10pOyIsIi8qKlxuICogQG5nZG9jIGNvbnRyb2xsZXJcbiAqIEBuYW1lIGNvbXBvbmVudHMubmF2aWdhdGlvbjpOYXZpZ2F0aW9uQ29udHJvbGxlclxuICpcbiAqIEByZXF1aXJlcyBhV0N1cnJlbmN5XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBdHRhY2ggdG8gYSBsaW5rICg8YT4pIGFuZCBpdCB3aWxsIHVwZGF0ZSBwYXJlbnQgZWxlbWVudCB3aXRoIFwiYWN0aXZlXCIgY2xhc3NcbiAqIGlmIHRoZSBocmVmIG9mIHRoZSBsaW5rIG1hdGNoZXMgdGhlIGN1cnJlbnQgcm91dGUuIE5vdGUgdGhhdCB0aGlzIHByb2JhYmx5XG4gKiB3b24ndCB3b3JrIHdpdGggSFRNTDUgcm91dGluZy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicpLmNvbnRyb2xsZXIoJ05hdmlnYXRpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgICckbG9jYWxTdG9yYWdlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRsb2NhbFN0b3JhZ2UsIGFXQ3VycmVuY3kpe1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAgICogQG5hbWUgaXNDb2xsYXBzZWRcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBTZXQgdG8gYHRydWVgIGlmIHRoZSBtZW51IGlzIGNvbGxhcHNlZFxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSByZXNldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogUmVzZXQgdGhlIGRhdGEgaW4gc3RvcmFnZSBhbmQgcmVmcmVzaCB0aGUgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKXtcbiAgICAgICAgICAgICRsb2NhbFN0b3JhZ2UuJHJlc2V0KCk7XG4gICAgICAgICAgICAkbG9jYXRpb24uaHJlZignLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIGdldEN1cnJlbmN5Q2xhc3NcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEdldCBjdXJyZW50IEZvbnRBd2Vzb21lIGNsYXNzIHRvIHVzZSBmb3IgbWVudVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLmdldEN1cnJlbmN5Q2xhc3MgPSBmdW5jdGlvbiBnZXRDdXJyZW5jeUNsYXNzKCl7XG4gICAgICAgICAgICByZXR1cm4gJ2ZhLScgKyBhV0N1cnJlbmN5LmdldEN1cnJlbmN5KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHdhTmF2TGlua1xuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICogQHJlcXVpcmVzICRsb2NhdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnKS5kaXJlY3RpdmUoJ3dhTmF2TGluaycsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJvdXRlQ2hhbmdlTGlzdGVuZXIoKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXR0cnMuaHJlZiA9PT0gJyMnICsgJGxvY2F0aW9uLnVybCgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoYWN0aXZlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHVuYmluZCA9ICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIHJvdXRlQ2hhbmdlTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHVuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuZmlsdGVyKCdjdXJyZW5jeUNvZGVUb1N5bWJvbCcsIFtcbiAgICAnY3VycmVuY3lTeW1ib2xNYXBwaW5nJyxcbiAgICBmdW5jdGlvbihjdXJyZW5jeVN5bWJvbE1hcHBpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW5jeVN5bWJvbE1hcHBpbmdbY29kZV07XG4gICAgICAgIH07XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgYVdDdXJyZW5jeVxuICpcbiAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTZXJ2aWNlIHRvIGdldC9zZXQgdGhlIHVzZXIncyBjdXJyZW5jeSBwcmVmZXJlbmNlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmZhY3RvcnkoJ2FXQ3VycmVuY3knLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUpe1xuICAgICAgICAvLyBTZXQgc2luY2Ugd2UgZG9uJ3QgeWV0IGhhdmUgYSBwZXJzaXN0ZW5jZSBsYXllclxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbmN5ID0gJ0dCUCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgY29tcG9uZW50cy5jdXJyZW5jeS5hV0N1cnJlbmN5I3NldEN1cnJlbmN5XG4gICAgICAgICAgICAgKiBAcGFyYW0gY3VycmVuY3kge3N0cmluZ30gMy1jaGFyYWN0ZXIgY3VycmVuY3kgY29kZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogUGVyc2lzdHMgY3VycmVuY3kgY29kZSBhbmQgc2V0cyBpdCBvbiAkcm9vdFNjb3BlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNldEN1cnJlbmN5OiBmdW5jdGlvbiBzZXRDdXJyZW5jeShjdXJyZW5jeSl7XG4gICAgICAgICAgICAgICAgLy8gVXNpbmcgJHJvb3RTY29wZSBhcyBpdCB3aWxsIGJlIGluY2x1ZGVkIHRocm91Z2hvdXQgdGhlIGVudGlyZSBhcHAuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW5jeSA9IGN1cnJlbmN5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgY29tcG9uZW50cy5jdXJyZW5jeS5hV0N1cnJlbmN5I2dldEN1cnJlbmN5XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBHZXRzIHRoZSB1c2VyJ3MgY3VycmVuY3kgY29kZSBmb3IgdGhlaXIgd2FsbGV0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEN1cnJlbmN5OiBmdW5jdGlvbiBnZXRDdXJyZW5jeSgpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbmN5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIGNvbnN0YW50XG4gKiBAbmFtZSBjdXJyZW5jeVN5bWJvbE1hcHBpbmdcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE9iamVjdCBvZiAzLWNoYXJhY3RlciBjdXJyZW5jeSBjb2RlcyBtYXBwaW5nIHRvIGN1cnJlbmN5IHN5bWJvbHMuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuY29uc3RhbnQoJ2N1cnJlbmN5U3ltYm9sTWFwcGluZycsIHtcbiAgICBHQlA6ICfCoycsXG4gICAgRVVSOiAn4oKsJyxcbiAgICBVU0Q6ICckJ1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuZmFjdG9yeSgnYVdhbGxldCcsIFtcbiAgICAnJGxvY2FsU3RvcmFnZScsXG4gICAgZnVuY3Rpb24oJGxvY2FsU3RvcmFnZSl7XG5cbiAgICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmNvbnRyb2xsZXIoJ1JlY29yZFRyYW5zYWN0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGxvY2F0aW9uJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbil7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICAgKiBAbmFtZSB0cmFuc2FjdGlvblxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgc2F2ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogU2F2ZXMgdHJhbnNhY3Rpb24gYW5kIHJldHVybnMgdG8gdHJhbnNhY3Rpb24gbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKXtcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5kYXRlID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgaWYoJGxvY2F0aW9uLnNlYXJjaCgndHlwZScpID09PSAncGF5Jyl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmFtb3VudCA9ICctJyArICRzY29wZS50cmFuc2FjdGlvbi5hbW91bnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50cmFuc2FjdGlvbik7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgY2FuY2VsXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBSZXR1cm4gdG8gdHJhbnNhY3Rpb24gbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCl7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmNvbnRyb2xsZXIoJ0xvZ3NDb250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICdhV0N1cnJlbmN5JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIGFXQ3VycmVuY3kpe1xuICAgICAgICAkc2NvcGUuc2V0Q3VycmVuY3kgPSBhV0N1cnJlbmN5LnNldEN1cnJlbmN5O1xuXG4gICAgICAgICRzY29wZS5sb2dzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTHVuY2gnLFxuICAgICAgICAgICAgICAgIGFtb3VudDogJzUuMjAnLFxuICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCkgLSAzMDAwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rpbm5lcicsXG4gICAgICAgICAgICAgICAgYW1vdW50OiAnMTUuODAnLFxuICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG5dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=