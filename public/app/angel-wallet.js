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
 *
 * Note: Perhaps this could become a preference service instead of currency service.
 */
angular.module('components.currency').factory('aWCurrency', [
    '$rootScope',
    '$sessionStorage',
    function($rootScope, $sessionStorage){
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

                $sessionStorage.currency = currency;
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
/**
 * @ngdoc service
 * @name aWallet
 *
 * @requires $sessionStorage
 *
 * @description
 * Service to get/set the user's wallet.
 */
angular.module('angelWallet').factory('aWallet', [
    '$sessionStorage',
    function($sessionStorage){
        $sessionStorage.$default({
            transactions:[
                {
                    description: 'Lunch',
                    amount: '5.20',
                    date: Date.now()/1000 - 60*60*6
                },
                {
                    description: 'Dinner',
                    amount: '15.80',
                    date: Date.now()/1000
                }
            ]
        });

        return {
            /**
             * @ngdoc method
             * @name angelWallet.aWallet#saveTransaction
             * @param transaction {object}
             * @param transaction.date {number} Unix timestamp of transaction
             * @param transaction.description {string} Description
             * @param transaction.amount {string} Value of transaction
             *
             * @description
             * Saves transaction to storage
             */
            saveTransaction: function addTransaction(transaction){
                // Note that I don't need angular.copy() here as ngStorage takes care of that for us

                $sessionStorage.transactions.push(transaction);
            },

            /**
             * @ngdoc method
             * @name angelWallet.aWallet#getTransactions
             * @return {Object[]} Array of transactions
             *
             * @description
             * Gets transaction data from storage
             */
            getTransactions: function getTransactions(){
                return $sessionStorage.transactions;
            }
        };
    }
]);

angular.module('angelWallet').controller('RecordTransactionController', [
    '$scope',
    '$location',
    'aWallet',
    function($scope, $location, aWallet){

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
            $scope.transaction.date = Math.round(Date.now()/1000);

            if($location.search('type') === 'pay'){
                $scope.transaction.amount = '-' + $scope.transaction.amount;
            }

            aWallet.saveTransaction($scope.transaction);

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
            $location.url('/');
        };
    }
]);
angular.module('angelWallet').controller('LogsController', [
    '$scope',
    'aWCurrency',
    'aWallet',
    function($scope, aWCurrency, aWallet){
        $scope.setCurrency = aWCurrency.setCurrency;

        $scope.logs = aWallet.getTransactions();
    }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3dhbGxldC93YWxsZXQtc2VydmljZS5qcyIsImFuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ25nU3RvcmFnZScsICdjb21wb25lbnRzLm5hdmlnYXRpb24nLCAnY29tcG9uZW50cy5uYXZMaW5rJywgJ2NvbXBvbmVudHMuY3VycmVuY3knXSlcbiAgICAuY29uZmlnKFtcbiAgICAgICAgJyRyb3V0ZVByb3ZpZGVyJyxcbiAgICAgICAgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ3NDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgY29udmVydGVkIHRvIEpTIGFuZCBpbmplY3RlZCBpblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9sb2dzL2xvZ3MuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvcGF5Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPXBheSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvZGVwb3NpdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9yZWNvcmQ/dHlwZT1kZXBvc2l0J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9yZWNvcmQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbiAgICAgICAgfVxuICAgIF0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsIFtdKTsiLCIvKipcbiAqIEBuZ2RvYyBjb250cm9sbGVyXG4gKiBAbmFtZSBjb21wb25lbnRzLm5hdmlnYXRpb246TmF2aWdhdGlvbkNvbnRyb2xsZXJcbiAqXG4gKiBAcmVxdWlyZXMgYVdDdXJyZW5jeVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nKS5jb250cm9sbGVyKCdOYXZpZ2F0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGxvY2F0aW9uJyxcbiAgICAnJGxvY2FsU3RvcmFnZScsXG4gICAgJ2FXQ3VycmVuY3knLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkbG9jYWxTdG9yYWdlLCBhV0N1cnJlbmN5KXtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgICAqIEBuYW1lIGlzQ29sbGFwc2VkXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogU2V0IHRvIGB0cnVlYCBpZiB0aGUgbWVudSBpcyBjb2xsYXBzZWRcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgcmVzZXRcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJlc2V0IHRoZSBkYXRhIGluIHN0b3JhZ2UgYW5kIHJlZnJlc2ggdGhlIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCl7XG4gICAgICAgICAgICAkbG9jYWxTdG9yYWdlLiRyZXNldCgpO1xuICAgICAgICAgICAgJGxvY2F0aW9uLmhyZWYoJy8nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSBnZXRDdXJyZW5jeUNsYXNzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBHZXQgY3VycmVudCBGb250QXdlc29tZSBjbGFzcyB0byB1c2UgZm9yIG1lbnVcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5nZXRDdXJyZW5jeUNsYXNzID0gZnVuY3Rpb24gZ2V0Q3VycmVuY3lDbGFzcygpe1xuICAgICAgICAgICAgcmV0dXJuICdmYS0nICsgYVdDdXJyZW5jeS5nZXRDdXJyZW5jeSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB3YU5hdkxpbmtcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEF0dGFjaCB0byBhIGxpbmsgKDxhPikgYW5kIGl0IHdpbGwgdXBkYXRlIHBhcmVudCBlbGVtZW50IHdpdGggXCJhY3RpdmVcIiBjbGFzc1xuICogaWYgdGhlIGhyZWYgb2YgdGhlIGxpbmsgbWF0Y2hlcyB0aGUgY3VycmVudCByb3V0ZS4gTm90ZSB0aGF0IHRoaXMgcHJvYmFibHlcbiAqIHdvbid0IHdvcmsgd2l0aCBIVE1MNSByb3V0aW5nLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZMaW5rJykuZGlyZWN0aXZlKCd3YU5hdkxpbmsnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiByb3V0ZUNoYW5nZUxpc3RlbmVyKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGF0dHJzLmhyZWYgPT09ICcjJyArICRsb2NhdGlvbi51cmwoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB1bmJpbmQgPSAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCByb3V0ZUNoYW5nZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB1bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmZpbHRlcignY3VycmVuY3lDb2RlVG9TeW1ib2wnLCBbXG4gICAgJ2N1cnJlbmN5U3ltYm9sTWFwcGluZycsXG4gICAgZnVuY3Rpb24oY3VycmVuY3lTeW1ib2xNYXBwaW5nKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVuY3lTeW1ib2xNYXBwaW5nW2NvZGVdO1xuICAgICAgICB9O1xuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lIGFXQ3VycmVuY3lcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZSB0byBnZXQvc2V0IHRoZSB1c2VyJ3MgY3VycmVuY3kgcHJlZmVyZW5jZS5cbiAqXG4gKiBOb3RlOiBQZXJoYXBzIHRoaXMgY291bGQgYmVjb21lIGEgcHJlZmVyZW5jZSBzZXJ2aWNlIGluc3RlYWQgb2YgY3VycmVuY3kgc2VydmljZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knKS5mYWN0b3J5KCdhV0N1cnJlbmN5JywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHNlc3Npb25TdG9yYWdlJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2Vzc2lvblN0b3JhZ2Upe1xuICAgICAgICAvLyBTZXQgc2luY2Ugd2UgZG9uJ3QgeWV0IGhhdmUgYSBwZXJzaXN0ZW5jZSBsYXllclxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbmN5ID0gJ0dCUCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgY29tcG9uZW50cy5jdXJyZW5jeS5hV0N1cnJlbmN5I3NldEN1cnJlbmN5XG4gICAgICAgICAgICAgKiBAcGFyYW0gY3VycmVuY3kge3N0cmluZ30gMy1jaGFyYWN0ZXIgY3VycmVuY3kgY29kZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogUGVyc2lzdHMgY3VycmVuY3kgY29kZSBhbmQgc2V0cyBpdCBvbiAkcm9vdFNjb3BlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNldEN1cnJlbmN5OiBmdW5jdGlvbiBzZXRDdXJyZW5jeShjdXJyZW5jeSl7XG4gICAgICAgICAgICAgICAgLy8gVXNpbmcgJHJvb3RTY29wZSBhcyBpdCB3aWxsIGJlIGluY2x1ZGVkIHRocm91Z2hvdXQgdGhlIGVudGlyZSBhcHAuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW5jeSA9IGN1cnJlbmN5O1xuXG4gICAgICAgICAgICAgICAgJHNlc3Npb25TdG9yYWdlLmN1cnJlbmN5ID0gY3VycmVuY3k7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICAgKiBAbmFtZSBjb21wb25lbnRzLmN1cnJlbmN5LmFXQ3VycmVuY3kjZ2V0Q3VycmVuY3lcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIEdldHMgdGhlIHVzZXIncyBjdXJyZW5jeSBjb2RlIGZvciB0aGVpciB3YWxsZXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0Q3VycmVuY3k6IGZ1bmN0aW9uIGdldEN1cnJlbmN5KCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRyb290U2NvcGUuY3VycmVuY3k7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2MgY29uc3RhbnRcbiAqIEBuYW1lIGN1cnJlbmN5U3ltYm9sTWFwcGluZ1xuICpcbiAqIEBkZXNjcmlwdGlvblxuICogT2JqZWN0IG9mIDMtY2hhcmFjdGVyIGN1cnJlbmN5IGNvZGVzIG1hcHBpbmcgdG8gY3VycmVuY3kgc3ltYm9scy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knKS5jb25zdGFudCgnY3VycmVuY3lTeW1ib2xNYXBwaW5nJywge1xuICAgIEdCUDogJ8KjJyxcbiAgICBFVVI6ICfigqwnLFxuICAgIFVTRDogJyQnXG59KTsiLCIvKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSBhV2FsbGV0XG4gKlxuICogQHJlcXVpcmVzICRzZXNzaW9uU3RvcmFnZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZSB0byBnZXQvc2V0IHRoZSB1c2VyJ3Mgd2FsbGV0LlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5mYWN0b3J5KCdhV2FsbGV0JywgW1xuICAgICckc2Vzc2lvblN0b3JhZ2UnLFxuICAgIGZ1bmN0aW9uKCRzZXNzaW9uU3RvcmFnZSl7XG4gICAgICAgICRzZXNzaW9uU3RvcmFnZS4kZGVmYXVsdCh7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM6W1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdMdW5jaCcsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogJzUuMjAnLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpLzEwMDAgLSA2MCo2MCo2XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGlubmVyJyxcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiAnMTUuODAnLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpLzEwMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGFuZ2VsV2FsbGV0LmFXYWxsZXQjc2F2ZVRyYW5zYWN0aW9uXG4gICAgICAgICAgICAgKiBAcGFyYW0gdHJhbnNhY3Rpb24ge29iamVjdH1cbiAgICAgICAgICAgICAqIEBwYXJhbSB0cmFuc2FjdGlvbi5kYXRlIHtudW1iZXJ9IFVuaXggdGltZXN0YW1wIG9mIHRyYW5zYWN0aW9uXG4gICAgICAgICAgICAgKiBAcGFyYW0gdHJhbnNhY3Rpb24uZGVzY3JpcHRpb24ge3N0cmluZ30gRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIEBwYXJhbSB0cmFuc2FjdGlvbi5hbW91bnQge3N0cmluZ30gVmFsdWUgb2YgdHJhbnNhY3Rpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIFNhdmVzIHRyYW5zYWN0aW9uIHRvIHN0b3JhZ2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2F2ZVRyYW5zYWN0aW9uOiBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbil7XG4gICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IEkgZG9uJ3QgbmVlZCBhbmd1bGFyLmNvcHkoKSBoZXJlIGFzIG5nU3RvcmFnZSB0YWtlcyBjYXJlIG9mIHRoYXQgZm9yIHVzXG5cbiAgICAgICAgICAgICAgICAkc2Vzc2lvblN0b3JhZ2UudHJhbnNhY3Rpb25zLnB1c2godHJhbnNhY3Rpb24pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICAgKiBAbmFtZSBhbmdlbFdhbGxldC5hV2FsbGV0I2dldFRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0W119IEFycmF5IG9mIHRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogR2V0cyB0cmFuc2FjdGlvbiBkYXRhIGZyb20gc3RvcmFnZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRUcmFuc2FjdGlvbnM6IGZ1bmN0aW9uIGdldFRyYW5zYWN0aW9ucygpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkc2Vzc2lvblN0b3JhZ2UudHJhbnNhY3Rpb25zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignUmVjb3JkVHJhbnNhY3Rpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgICdhV2FsbGV0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYVdhbGxldCl7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICAgKiBAbmFtZSB0cmFuc2FjdGlvblxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgc2F2ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogU2F2ZXMgdHJhbnNhY3Rpb24gYW5kIHJldHVybnMgdG8gdHJhbnNhY3Rpb24gbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKXtcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5kYXRlID0gTWF0aC5yb3VuZChEYXRlLm5vdygpLzEwMDApO1xuXG4gICAgICAgICAgICBpZigkbG9jYXRpb24uc2VhcmNoKCd0eXBlJykgPT09ICdwYXknKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50ID0gJy0nICsgJHNjb3BlLnRyYW5zYWN0aW9uLmFtb3VudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYVdhbGxldC5zYXZlVHJhbnNhY3Rpb24oJHNjb3BlLnRyYW5zYWN0aW9uKTtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSBjYW5jZWxcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJldHVybiB0byB0cmFuc2FjdGlvbiBsb2dcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKXtcbiAgICAgICAgICAgICRsb2NhdGlvbi51cmwoJy8nKTtcbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdMb2dzQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgJ2FXYWxsZXQnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgYVdDdXJyZW5jeSwgYVdhbGxldCl7XG4gICAgICAgICRzY29wZS5zZXRDdXJyZW5jeSA9IGFXQ3VycmVuY3kuc2V0Q3VycmVuY3k7XG5cbiAgICAgICAgJHNjb3BlLmxvZ3MgPSBhV2FsbGV0LmdldFRyYW5zYWN0aW9ucygpO1xuICAgIH1cbl0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==