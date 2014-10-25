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
 * @requires $sessionStorage
 * @requires aWCurrency
 * @requires aWallet
 *
 * @description
 * Attach to a link (<a>) and it will update parent element with "active" class
 * if the href of the link matches the current route. Note that this probably
 * won't work with HTML5 routing.
 */
angular.module('components.navigation').controller('NavigationController', [
    '$scope',
    '$location',
    '$window',
    '$timeout',
    '$rootScope',
    '$sessionStorage',
    'aWCurrency',
    'aWallet',
    function($scope, $location, $window, $timeout, $rootScope, $sessionStorage, aWCurrency, aWallet){

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
         * @ngdoc property
         * @name balance
         * @type {number}
         *
         * @description
         * The balance in the user's wallet
         */
        $scope.balance = aWallet.getBalance();

        /**
         * @ngdoc method
         * @name reset
         *
         * @description
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){
            $sessionStorage.$reset();

            // ngStorage doesn't reset immediately so wait until it does (a timeout of 100ms)
            $timeout(function() {
                $window.location.href = '#';
                $window.location.reload();
            }, 150);
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

        $rootScope.$on('transaction.add', function(){
            $scope.balance = aWallet.getBalance();
        });
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
 * @requires $sessionStorage
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
        $sessionStorage.$default({
            currency: 'GBP'
        });

        $rootScope.currency = $sessionStorage.currency;

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
    '$rootScope',
    '$sessionStorage',
    function($rootScope, $sessionStorage){
        $sessionStorage.$default({
            transactions:[
                {
                    description: 'Visited Bank',
                    amount: '25',
                    date: Date.now()/1000 - 60*60*7
                },
                {
                    description: 'Lunch',
                    amount: '-5.20',
                    date: Date.now()/1000 - 60*60*6
                },
                {
                    description: 'Dinner',
                    amount: '-15.60',
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

                $rootScope.$emit('transaction.add', transaction);
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
            },

            /**
             * @ngdoc method
             * @name angelWallet.aWallet#getTransactions
             * @return {Object[]} Array of transactions
             *
             * @description
             * Gets transaction data from storage
             */
            getBalance: function getBalance(){
                return $sessionStorage.transactions.reduce(function(accum, transaction){
                    return accum + parseFloat(transaction.amount);
                }, 0);
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

            if($location.search().type === 'pay'){
                $scope.transaction.amount = $scope.transaction.amount * -1;
            }

            aWallet.saveTransaction($scope.transaction);

            $location.url('/');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3dhbGxldC93YWxsZXQtc2VydmljZS5qcyIsImFuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ25nU3RvcmFnZScsICdjb21wb25lbnRzLm5hdmlnYXRpb24nLCAnY29tcG9uZW50cy5uYXZMaW5rJywgJ2NvbXBvbmVudHMuY3VycmVuY3knXSlcbiAgICAuY29uZmlnKFtcbiAgICAgICAgJyRyb3V0ZVByb3ZpZGVyJyxcbiAgICAgICAgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ3NDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgY29udmVydGVkIHRvIEpTIGFuZCBpbmplY3RlZCBpblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9sb2dzL2xvZ3MuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvcGF5Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPXBheSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvZGVwb3NpdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9yZWNvcmQ/dHlwZT1kZXBvc2l0J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9yZWNvcmQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAtc3JjL2FuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcbiAgICAgICAgfVxuICAgIF0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsIFtdKTsiLCIvKipcbiAqIEBuZ2RvYyBjb250cm9sbGVyXG4gKiBAbmFtZSBjb21wb25lbnRzLm5hdmlnYXRpb246TmF2aWdhdGlvbkNvbnRyb2xsZXJcbiAqXG4gKiBAcmVxdWlyZXMgJHNlc3Npb25TdG9yYWdlXG4gKiBAcmVxdWlyZXMgYVdDdXJyZW5jeVxuICogQHJlcXVpcmVzIGFXYWxsZXRcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEF0dGFjaCB0byBhIGxpbmsgKDxhPikgYW5kIGl0IHdpbGwgdXBkYXRlIHBhcmVudCBlbGVtZW50IHdpdGggXCJhY3RpdmVcIiBjbGFzc1xuICogaWYgdGhlIGhyZWYgb2YgdGhlIGxpbmsgbWF0Y2hlcyB0aGUgY3VycmVudCByb3V0ZS4gTm90ZSB0aGF0IHRoaXMgcHJvYmFibHlcbiAqIHdvbid0IHdvcmsgd2l0aCBIVE1MNSByb3V0aW5nLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZpZ2F0aW9uJykuY29udHJvbGxlcignTmF2aWdhdGlvbkNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgJyR3aW5kb3cnLFxuICAgICckdGltZW91dCcsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2Vzc2lvblN0b3JhZ2UnLFxuICAgICdhV0N1cnJlbmN5JyxcbiAgICAnYVdhbGxldCcsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICR3aW5kb3csICR0aW1lb3V0LCAkcm9vdFNjb3BlLCAkc2Vzc2lvblN0b3JhZ2UsIGFXQ3VycmVuY3ksIGFXYWxsZXQpe1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAgICogQG5hbWUgaXNDb2xsYXBzZWRcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBTZXQgdG8gYHRydWVgIGlmIHRoZSBtZW51IGlzIGNvbGxhcHNlZFxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgICAqIEBuYW1lIGJhbGFuY2VcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRoZSBiYWxhbmNlIGluIHRoZSB1c2VyJ3Mgd2FsbGV0XG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuYmFsYW5jZSA9IGFXYWxsZXQuZ2V0QmFsYW5jZSgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIHJlc2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBSZXNldCB0aGUgZGF0YSBpbiBzdG9yYWdlIGFuZCByZWZyZXNoIHRoZSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpe1xuICAgICAgICAgICAgJHNlc3Npb25TdG9yYWdlLiRyZXNldCgpO1xuXG4gICAgICAgICAgICAvLyBuZ1N0b3JhZ2UgZG9lc24ndCByZXNldCBpbW1lZGlhdGVseSBzbyB3YWl0IHVudGlsIGl0IGRvZXMgKGEgdGltZW91dCBvZiAxMDBtcylcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjJztcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfSwgMTUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSBnZXRDdXJyZW5jeUNsYXNzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBHZXQgY3VycmVudCBGb250QXdlc29tZSBjbGFzcyB0byB1c2UgZm9yIG1lbnVcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5nZXRDdXJyZW5jeUNsYXNzID0gZnVuY3Rpb24gZ2V0Q3VycmVuY3lDbGFzcygpe1xuICAgICAgICAgICAgcmV0dXJuICdmYS0nICsgYVdDdXJyZW5jeS5nZXRDdXJyZW5jeSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3RyYW5zYWN0aW9uLmFkZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUuYmFsYW5jZSA9IGFXYWxsZXQuZ2V0QmFsYW5jZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHdhTmF2TGlua1xuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICogQHJlcXVpcmVzICRsb2NhdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdkxpbmsnKS5kaXJlY3RpdmUoJ3dhTmF2TGluaycsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRsb2NhdGlvbicsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJvdXRlQ2hhbmdlTGlzdGVuZXIoKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXR0cnMuaHJlZiA9PT0gJyMnICsgJGxvY2F0aW9uLnVybCgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoYWN0aXZlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHVuYmluZCA9ICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIHJvdXRlQ2hhbmdlTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHVuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuZmlsdGVyKCdjdXJyZW5jeUNvZGVUb1N5bWJvbCcsIFtcbiAgICAnY3VycmVuY3lTeW1ib2xNYXBwaW5nJyxcbiAgICBmdW5jdGlvbihjdXJyZW5jeVN5bWJvbE1hcHBpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW5jeVN5bWJvbE1hcHBpbmdbY29kZV07XG4gICAgICAgIH07XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgYVdDdXJyZW5jeVxuICpcbiAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gKiBAcmVxdWlyZXMgJHNlc3Npb25TdG9yYWdlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTZXJ2aWNlIHRvIGdldC9zZXQgdGhlIHVzZXIncyBjdXJyZW5jeSBwcmVmZXJlbmNlLlxuICpcbiAqIE5vdGU6IFBlcmhhcHMgdGhpcyBjb3VsZCBiZWNvbWUgYSBwcmVmZXJlbmNlIHNlcnZpY2UgaW5zdGVhZCBvZiBjdXJyZW5jeSBzZXJ2aWNlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmZhY3RvcnkoJ2FXQ3VycmVuY3knLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2Vzc2lvblN0b3JhZ2UnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzZXNzaW9uU3RvcmFnZSl7XG4gICAgICAgICRzZXNzaW9uU3RvcmFnZS4kZGVmYXVsdCh7XG4gICAgICAgICAgICBjdXJyZW5jeTogJ0dCUCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW5jeSA9ICRzZXNzaW9uU3RvcmFnZS5jdXJyZW5jeTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICAgKiBAbmFtZSBjb21wb25lbnRzLmN1cnJlbmN5LmFXQ3VycmVuY3kjc2V0Q3VycmVuY3lcbiAgICAgICAgICAgICAqIEBwYXJhbSBjdXJyZW5jeSB7c3RyaW5nfSAzLWNoYXJhY3RlciBjdXJyZW5jeSBjb2RlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBQZXJzaXN0cyBjdXJyZW5jeSBjb2RlIGFuZCBzZXRzIGl0IG9uICRyb290U2NvcGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0Q3VycmVuY3k6IGZ1bmN0aW9uIHNldEN1cnJlbmN5KGN1cnJlbmN5KXtcbiAgICAgICAgICAgICAgICAvLyBVc2luZyAkcm9vdFNjb3BlIGFzIGl0IHdpbGwgYmUgaW5jbHVkZWQgdGhyb3VnaG91dCB0aGUgZW50aXJlIGFwcC5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbmN5ID0gY3VycmVuY3k7XG5cbiAgICAgICAgICAgICAgICAkc2Vzc2lvblN0b3JhZ2UuY3VycmVuY3kgPSBjdXJyZW5jeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMuY3VycmVuY3kuYVdDdXJyZW5jeSNnZXRDdXJyZW5jeVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogR2V0cyB0aGUgdXNlcidzIGN1cnJlbmN5IGNvZGUgZm9yIHRoZWlyIHdhbGxldFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRDdXJyZW5jeTogZnVuY3Rpb24gZ2V0Q3VycmVuY3koKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5jdXJyZW5jeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBjb25zdGFudFxuICogQG5hbWUgY3VycmVuY3lTeW1ib2xNYXBwaW5nXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBPYmplY3Qgb2YgMy1jaGFyYWN0ZXIgY3VycmVuY3kgY29kZXMgbWFwcGluZyB0byBjdXJyZW5jeSBzeW1ib2xzLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmNvbnN0YW50KCdjdXJyZW5jeVN5bWJvbE1hcHBpbmcnLCB7XG4gICAgR0JQOiAnwqMnLFxuICAgIEVVUjogJ+KCrCcsXG4gICAgVVNEOiAnJCdcbn0pOyIsIi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lIGFXYWxsZXRcbiAqXG4gKiBAcmVxdWlyZXMgJHNlc3Npb25TdG9yYWdlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTZXJ2aWNlIHRvIGdldC9zZXQgdGhlIHVzZXIncyB3YWxsZXQuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmZhY3RvcnkoJ2FXYWxsZXQnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2Vzc2lvblN0b3JhZ2UnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzZXNzaW9uU3RvcmFnZSl7XG4gICAgICAgICRzZXNzaW9uU3RvcmFnZS4kZGVmYXVsdCh7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM6W1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdWaXNpdGVkIEJhbmsnLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6ICcyNScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCkvMTAwMCAtIDYwKjYwKjdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdMdW5jaCcsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogJy01LjIwJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKS8xMDAwIC0gNjAqNjAqNlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rpbm5lcicsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogJy0xNS42MCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCkvMTAwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgYW5nZWxXYWxsZXQuYVdhbGxldCNzYXZlVHJhbnNhY3Rpb25cbiAgICAgICAgICAgICAqIEBwYXJhbSB0cmFuc2FjdGlvbiB7b2JqZWN0fVxuICAgICAgICAgICAgICogQHBhcmFtIHRyYW5zYWN0aW9uLmRhdGUge251bWJlcn0gVW5peCB0aW1lc3RhbXAgb2YgdHJhbnNhY3Rpb25cbiAgICAgICAgICAgICAqIEBwYXJhbSB0cmFuc2FjdGlvbi5kZXNjcmlwdGlvbiB7c3RyaW5nfSBEZXNjcmlwdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHRyYW5zYWN0aW9uLmFtb3VudCB7c3RyaW5nfSBWYWx1ZSBvZiB0cmFuc2FjdGlvblxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogU2F2ZXMgdHJhbnNhY3Rpb24gdG8gc3RvcmFnZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzYXZlVHJhbnNhY3Rpb246IGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKXtcbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgSSBkb24ndCBuZWVkIGFuZ3VsYXIuY29weSgpIGhlcmUgYXMgbmdTdG9yYWdlIHRha2VzIGNhcmUgb2YgdGhhdCBmb3IgdXNcblxuICAgICAgICAgICAgICAgICRzZXNzaW9uU3RvcmFnZS50cmFuc2FjdGlvbnMucHVzaCh0cmFuc2FjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCd0cmFuc2FjdGlvbi5hZGQnLCB0cmFuc2FjdGlvbik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGFuZ2VsV2FsbGV0LmFXYWxsZXQjZ2V0VHJhbnNhY3Rpb25zXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gQXJyYXkgb2YgdHJhbnNhY3Rpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBHZXRzIHRyYW5zYWN0aW9uIGRhdGEgZnJvbSBzdG9yYWdlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFRyYW5zYWN0aW9uczogZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25zKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRzZXNzaW9uU3RvcmFnZS50cmFuc2FjdGlvbnM7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGFuZ2VsV2FsbGV0LmFXYWxsZXQjZ2V0VHJhbnNhY3Rpb25zXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gQXJyYXkgb2YgdHJhbnNhY3Rpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBHZXRzIHRyYW5zYWN0aW9uIGRhdGEgZnJvbSBzdG9yYWdlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEJhbGFuY2U6IGZ1bmN0aW9uIGdldEJhbGFuY2UoKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNlc3Npb25TdG9yYWdlLnRyYW5zYWN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24oYWNjdW0sIHRyYW5zYWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtICsgcGFyc2VGbG9hdCh0cmFuc2FjdGlvbi5hbW91bnQpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignUmVjb3JkVHJhbnNhY3Rpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgICdhV2FsbGV0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYVdhbGxldCl7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICAgKiBAbmFtZSB0cmFuc2FjdGlvblxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgc2F2ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogU2F2ZXMgdHJhbnNhY3Rpb24gYW5kIHJldHVybnMgdG8gdHJhbnNhY3Rpb24gbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKXtcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5kYXRlID0gTWF0aC5yb3VuZChEYXRlLm5vdygpLzEwMDApO1xuXG4gICAgICAgICAgICBpZigkbG9jYXRpb24uc2VhcmNoKCkudHlwZSA9PT0gJ3BheScpe1xuICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5hbW91bnQgPSAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50ICogLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFXYWxsZXQuc2F2ZVRyYW5zYWN0aW9uKCRzY29wZS50cmFuc2FjdGlvbik7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi51cmwoJy8nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSBjYW5jZWxcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJldHVybiB0byB0cmFuc2FjdGlvbiBsb2dcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKXtcbiAgICAgICAgICAgICRsb2NhdGlvbi51cmwoJy8nKTtcbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdMb2dzQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgJ2FXYWxsZXQnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgYVdDdXJyZW5jeSwgYVdhbGxldCl7XG4gICAgICAgICRzY29wZS5zZXRDdXJyZW5jeSA9IGFXQ3VycmVuY3kuc2V0Q3VycmVuY3k7XG5cbiAgICAgICAgJHNjb3BlLmxvZ3MgPSBhV2FsbGV0LmdldFRyYW5zYWN0aW9ucygpO1xuICAgIH1cbl0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==