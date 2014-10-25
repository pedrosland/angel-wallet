angular.module('angelWallet', ['ngRoute', 'ui.bootstrap', 'ngStorage', 'components.navigation', 'components.navLink', 'components.currency'])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3dhbGxldC93YWxsZXQtc2VydmljZS5qcyIsImFuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ25nU3RvcmFnZScsICdjb21wb25lbnRzLm5hdmlnYXRpb24nLCAnY29tcG9uZW50cy5uYXZMaW5rJywgJ2NvbXBvbmVudHMuY3VycmVuY3knXSlcbiAgICAuY29uZmlnKFtcbiAgICAgICAgJyRyb3V0ZVByb3ZpZGVyJyxcbiAgICAgICAgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ3NDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgY29udmVydGVkIHRvIEpTIGFuZCBpbmplY3RlZCBpblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9sb2dzL2xvZ3MuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvcGF5Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPXBheSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvZGVwb3NpdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9yZWNvcmQ/dHlwZT1kZXBvc2l0J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9yZWNvcmQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbiAgICAgICAgfVxuICAgIF0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsIFtdKTsiLCIvKipcbiAqIEBuZ2RvYyBjb250cm9sbGVyXG4gKiBAbmFtZSBjb21wb25lbnRzLm5hdmlnYXRpb246TmF2aWdhdGlvbkNvbnRyb2xsZXJcbiAqXG4gKiBAcmVxdWlyZXMgYVdDdXJyZW5jeVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nKS5jb250cm9sbGVyKCdOYXZpZ2F0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGxvY2F0aW9uJyxcbiAgICAnJGxvY2FsU3RvcmFnZScsXG4gICAgJ2FXQ3VycmVuY3knLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkbG9jYWxTdG9yYWdlLCBhV0N1cnJlbmN5KXtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgICAqIEBuYW1lIGlzQ29sbGFwc2VkXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogU2V0IHRvIGB0cnVlYCBpZiB0aGUgbWVudSBpcyBjb2xsYXBzZWRcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgcmVzZXRcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJlc2V0IHRoZSBkYXRhIGluIHN0b3JhZ2UgYW5kIHJlZnJlc2ggdGhlIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCl7XG4gICAgICAgICAgICAkbG9jYWxTdG9yYWdlLiRyZXNldCgpO1xuICAgICAgICAgICAgJGxvY2F0aW9uLmhyZWYoJy8nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSBnZXRDdXJyZW5jeUNsYXNzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBHZXQgY3VycmVudCBGb250QXdlc29tZSBjbGFzcyB0byB1c2UgZm9yIG1lbnVcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5nZXRDdXJyZW5jeUNsYXNzID0gZnVuY3Rpb24gZ2V0Q3VycmVuY3lDbGFzcygpe1xuICAgICAgICAgICAgcmV0dXJuICdmYS0nICsgYVdDdXJyZW5jeS5nZXRDdXJyZW5jeSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB3YU5hdkxpbmtcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEF0dGFjaCB0byBhIGxpbmsgKDxhPikgYW5kIGl0IHdpbGwgdXBkYXRlIHBhcmVudCBlbGVtZW50IHdpdGggXCJhY3RpdmVcIiBjbGFzc1xuICogaWYgdGhlIGhyZWYgb2YgdGhlIGxpbmsgbWF0Y2hlcyB0aGUgY3VycmVudCByb3V0ZS4gTm90ZSB0aGF0IHRoaXMgcHJvYmFibHlcbiAqIHdvbid0IHdvcmsgd2l0aCBIVE1MNSByb3V0aW5nLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZMaW5rJykuZGlyZWN0aXZlKCd3YU5hdkxpbmsnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiByb3V0ZUNoYW5nZUxpc3RlbmVyKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGF0dHJzLmhyZWYgPT09ICcjJyArICRsb2NhdGlvbi51cmwoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB1bmJpbmQgPSAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCByb3V0ZUNoYW5nZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB1bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmZpbHRlcignY3VycmVuY3lDb2RlVG9TeW1ib2wnLCBbXG4gICAgJ2N1cnJlbmN5U3ltYm9sTWFwcGluZycsXG4gICAgZnVuY3Rpb24oY3VycmVuY3lTeW1ib2xNYXBwaW5nKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVuY3lTeW1ib2xNYXBwaW5nW2NvZGVdO1xuICAgICAgICB9O1xuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lIGFXQ3VycmVuY3lcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZSB0byBnZXQvc2V0IHRoZSB1c2VyJ3MgY3VycmVuY3kgcHJlZmVyZW5jZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knKS5mYWN0b3J5KCdhV0N1cnJlbmN5JywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlKXtcbiAgICAgICAgLy8gU2V0IHNpbmNlIHdlIGRvbid0IHlldCBoYXZlIGEgcGVyc2lzdGVuY2UgbGF5ZXJcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW5jeSA9ICdHQlAnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMuY3VycmVuY3kuYVdDdXJyZW5jeSNzZXRDdXJyZW5jeVxuICAgICAgICAgICAgICogQHBhcmFtIGN1cnJlbmN5IHtzdHJpbmd9IDMtY2hhcmFjdGVyIGN1cnJlbmN5IGNvZGVcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIFBlcnNpc3RzIGN1cnJlbmN5IGNvZGUgYW5kIHNldHMgaXQgb24gJHJvb3RTY29wZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXRDdXJyZW5jeTogZnVuY3Rpb24gc2V0Q3VycmVuY3koY3VycmVuY3kpe1xuICAgICAgICAgICAgICAgIC8vIFVzaW5nICRyb290U2NvcGUgYXMgaXQgd2lsbCBiZSBpbmNsdWRlZCB0aHJvdWdob3V0IHRoZSBlbnRpcmUgYXBwLlxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVuY3kgPSBjdXJyZW5jeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMuY3VycmVuY3kuYVdDdXJyZW5jeSNnZXRDdXJyZW5jeVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogR2V0cyB0aGUgdXNlcidzIGN1cnJlbmN5IGNvZGUgZm9yIHRoZWlyIHdhbGxldFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRDdXJyZW5jeTogZnVuY3Rpb24gZ2V0Q3VycmVuY3koKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5jdXJyZW5jeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBjb25zdGFudFxuICogQG5hbWUgY3VycmVuY3lTeW1ib2xNYXBwaW5nXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBPYmplY3Qgb2YgMy1jaGFyYWN0ZXIgY3VycmVuY3kgY29kZXMgbWFwcGluZyB0byBjdXJyZW5jeSBzeW1ib2xzLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmNvbnN0YW50KCdjdXJyZW5jeVN5bWJvbE1hcHBpbmcnLCB7XG4gICAgR0JQOiAnwqMnLFxuICAgIEVVUjogJ+KCrCcsXG4gICAgVVNEOiAnJCdcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmZhY3RvcnkoJ2FXYWxsZXQnLCBbXG4gICAgJyRsb2NhbFN0b3JhZ2UnLFxuICAgIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2Upe1xuXG4gICAgfVxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pe1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAgICogQG5hbWUgdHJhbnNhY3Rpb25cbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS50cmFuc2FjdGlvbiA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIHNhdmVcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFNhdmVzIHRyYW5zYWN0aW9uIGFuZCByZXR1cm5zIHRvIHRyYW5zYWN0aW9uIGxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCl7XG4gICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgIGlmKCRsb2NhdGlvbi5zZWFyY2goJ3R5cGUnKSA9PT0gJ3BheScpe1xuICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5hbW91bnQgPSAnLScgKyAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIGNhbmNlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogUmV0dXJuIHRvIHRyYW5zYWN0aW9uIGxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpe1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdMb2dzQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBhV0N1cnJlbmN5KXtcbiAgICAgICAgJHNjb3BlLnNldEN1cnJlbmN5ID0gYVdDdXJyZW5jeS5zZXRDdXJyZW5jeTtcblxuICAgICAgICAkc2NvcGUubG9ncyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgICBhbW91bnQ6ICc1LjIwJyxcbiAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpIC0gMzAwMDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEaW5uZXInLFxuICAgICAgICAgICAgICAgIGFtb3VudDogJzE1LjgwJyxcbiAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9