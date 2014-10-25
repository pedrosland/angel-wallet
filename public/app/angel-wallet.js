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
    '$rootScope',
    '$location',
    'aWallet',
    function($scope, $rootScope, $location, aWallet){

        /**
         * @ngdoc property
         * @name depositType
         * @type {string}
         */
        $scope.depositType = $location.search().type;

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

            if($scope.depositType === 'pay'){
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

        var unbind = $rootScope.$on('$routeUpdate', function(){
            $scope.depositType = $location.search().type;
        });

        $scope.$on('$destroy', function(){
            unbind();
        });
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
/**
 * @ngdoc directive
 * @name aWBalanceCheck
 *
 * @requires aWallet
 *
 * @description
 * Validation directive to ensure non-negative balance
 */
angular.module('angelWallet').directive('aWBalanceCheck', [
    'aWallet',
    function(aWallet){
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                depositType: '=aWBalanceCheck'
            },
            link: function(scope, element, attrs, ctrl){
                ctrl.$validators.balanceCheck = function(modelValue, viewValue){
                    if(ctrl.$isEmpty(modelValue)){
                        return true;
                    }

                    // The user is adding money so balance will increase
                    if(scope.depositType === 'deposit'){
                        return true;
                    }

                    // If the user's balance and this transaction will keep the balance non-negative then it is valid
                    if(aWallet.getBalance() - modelValue >= 0){
                        return true;
                    }

                    // Invalid
                    return false;
                };

                scope.$watch('depositType', function(newValue, oldValue){
                    ctrl.$validate();
                });
            }
        };
    }]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3dhbGxldC93YWxsZXQtc2VydmljZS5qcyIsImFuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvYmFsYW5jZS1jaGVjay9iYWxhbmNlLWNoZWNrLWRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFuZ2VsLXdhbGxldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcsIFsnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAnbmdTdG9yYWdlJywgJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsICdjb21wb25lbnRzLm5hdkxpbmsnLCAnY29tcG9uZW50cy5jdXJyZW5jeSddKVxuICAgIC5jb25maWcoW1xuICAgICAgICAnJHJvdXRlUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9nc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gSlMgYW5kIGluamVjdGVkIGluXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L2xvZ3MvbG9ncy5odG1sJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9wYXknLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvcmVjb3JkP3R5cGU9cGF5J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9kZXBvc2l0Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPWRlcG9zaXQnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL3JlY29yZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlY29yZFRyYW5zYWN0aW9uQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L3JlY29yZC10cmFuc2FjdGlvbi9yZWNvcmQtdHJhbnNhY3Rpb24uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuICAgICAgICB9XG4gICAgXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2TGluaycsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZpZ2F0aW9uJywgW10pOyIsIi8qKlxuICogQG5nZG9jIGNvbnRyb2xsZXJcbiAqIEBuYW1lIGNvbXBvbmVudHMubmF2aWdhdGlvbjpOYXZpZ2F0aW9uQ29udHJvbGxlclxuICpcbiAqIEByZXF1aXJlcyAkc2Vzc2lvblN0b3JhZ2VcbiAqIEByZXF1aXJlcyBhV0N1cnJlbmN5XG4gKiBAcmVxdWlyZXMgYVdhbGxldFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQXR0YWNoIHRvIGEgbGluayAoPGE+KSBhbmQgaXQgd2lsbCB1cGRhdGUgcGFyZW50IGVsZW1lbnQgd2l0aCBcImFjdGl2ZVwiIGNsYXNzXG4gKiBpZiB0aGUgaHJlZiBvZiB0aGUgbGluayBtYXRjaGVzIHRoZSBjdXJyZW50IHJvdXRlLiBOb3RlIHRoYXQgdGhpcyBwcm9iYWJseVxuICogd29uJ3Qgd29yayB3aXRoIEhUTUw1IHJvdXRpbmcuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLm5hdmlnYXRpb24nKS5jb250cm9sbGVyKCdOYXZpZ2F0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGxvY2F0aW9uJyxcbiAgICAnJHdpbmRvdycsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzZXNzaW9uU3RvcmFnZScsXG4gICAgJ2FXQ3VycmVuY3knLFxuICAgICdhV2FsbGV0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHRpbWVvdXQsICRyb290U2NvcGUsICRzZXNzaW9uU3RvcmFnZSwgYVdDdXJyZW5jeSwgYVdhbGxldCl7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICAgKiBAbmFtZSBpc0NvbGxhcHNlZFxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFNldCB0byBgdHJ1ZWAgaWYgdGhlIG1lbnUgaXMgY29sbGFwc2VkXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAgICogQG5hbWUgYmFsYW5jZVxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogVGhlIGJhbGFuY2UgaW4gdGhlIHVzZXIncyB3YWxsZXRcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5iYWxhbmNlID0gYVdhbGxldC5nZXRCYWxhbmNlKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgcmVzZXRcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFJlc2V0IHRoZSBkYXRhIGluIHN0b3JhZ2UgYW5kIHJlZnJlc2ggdGhlIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCl7XG4gICAgICAgICAgICAkc2Vzc2lvblN0b3JhZ2UuJHJlc2V0KCk7XG5cbiAgICAgICAgICAgIC8vIG5nU3RvcmFnZSBkb2Vzbid0IHJlc2V0IGltbWVkaWF0ZWx5IHNvIHdhaXQgdW50aWwgaXQgZG9lcyAoYSB0aW1lb3V0IG9mIDEwMG1zKVxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyMnO1xuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9LCAxNTApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIGdldEN1cnJlbmN5Q2xhc3NcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEdldCBjdXJyZW50IEZvbnRBd2Vzb21lIGNsYXNzIHRvIHVzZSBmb3IgbWVudVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLmdldEN1cnJlbmN5Q2xhc3MgPSBmdW5jdGlvbiBnZXRDdXJyZW5jeUNsYXNzKCl7XG4gICAgICAgICAgICByZXR1cm4gJ2ZhLScgKyBhV0N1cnJlbmN5LmdldEN1cnJlbmN5KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndHJhbnNhY3Rpb24uYWRkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5iYWxhbmNlID0gYVdhbGxldC5nZXRCYWxhbmNlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgd2FOYXZMaW5rXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gKiBAcmVxdWlyZXMgJGxvY2F0aW9uXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBdHRhY2ggdG8gYSBsaW5rICg8YT4pIGFuZCBpdCB3aWxsIHVwZGF0ZSBwYXJlbnQgZWxlbWVudCB3aXRoIFwiYWN0aXZlXCIgY2xhc3NcbiAqIGlmIHRoZSBocmVmIG9mIHRoZSBsaW5rIG1hdGNoZXMgdGhlIGN1cnJlbnQgcm91dGUuIE5vdGUgdGhhdCB0aGlzIHByb2JhYmx5XG4gKiB3b24ndCB3b3JrIHdpdGggSFRNTDUgcm91dGluZy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2TGluaycpLmRpcmVjdGl2ZSgnd2FOYXZMaW5rJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJGxvY2F0aW9uJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24pe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcm91dGVDaGFuZ2VMaXN0ZW5lcigpe1xuICAgICAgICAgICAgICAgICAgICBpZihhdHRycy5ocmVmID09PSAnIycgKyAkbG9jYXRpb24udXJsKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihhY3RpdmUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdW5iaW5kID0gJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0Jywgcm91dGVDaGFuZ2VMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdW5iaW5kKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knKS5maWx0ZXIoJ2N1cnJlbmN5Q29kZVRvU3ltYm9sJywgW1xuICAgICdjdXJyZW5jeVN5bWJvbE1hcHBpbmcnLFxuICAgIGZ1bmN0aW9uKGN1cnJlbmN5U3ltYm9sTWFwcGluZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbmN5U3ltYm9sTWFwcGluZ1tjb2RlXTtcbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSBhV0N1cnJlbmN5XG4gKlxuICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAqIEByZXF1aXJlcyAkc2Vzc2lvblN0b3JhZ2VcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNlcnZpY2UgdG8gZ2V0L3NldCB0aGUgdXNlcidzIGN1cnJlbmN5IHByZWZlcmVuY2UuXG4gKlxuICogTm90ZTogUGVyaGFwcyB0aGlzIGNvdWxkIGJlY29tZSBhIHByZWZlcmVuY2Ugc2VydmljZSBpbnN0ZWFkIG9mIGN1cnJlbmN5IHNlcnZpY2UuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuZmFjdG9yeSgnYVdDdXJyZW5jeScsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzZXNzaW9uU3RvcmFnZScsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNlc3Npb25TdG9yYWdlKXtcbiAgICAgICAgJHNlc3Npb25TdG9yYWdlLiRkZWZhdWx0KHtcbiAgICAgICAgICAgIGN1cnJlbmN5OiAnR0JQJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbmN5ID0gJHNlc3Npb25TdG9yYWdlLmN1cnJlbmN5O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgICAqIEBuYW1lIGNvbXBvbmVudHMuY3VycmVuY3kuYVdDdXJyZW5jeSNzZXRDdXJyZW5jeVxuICAgICAgICAgICAgICogQHBhcmFtIGN1cnJlbmN5IHtzdHJpbmd9IDMtY2hhcmFjdGVyIGN1cnJlbmN5IGNvZGVcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIFBlcnNpc3RzIGN1cnJlbmN5IGNvZGUgYW5kIHNldHMgaXQgb24gJHJvb3RTY29wZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXRDdXJyZW5jeTogZnVuY3Rpb24gc2V0Q3VycmVuY3koY3VycmVuY3kpe1xuICAgICAgICAgICAgICAgIC8vIFVzaW5nICRyb290U2NvcGUgYXMgaXQgd2lsbCBiZSBpbmNsdWRlZCB0aHJvdWdob3V0IHRoZSBlbnRpcmUgYXBwLlxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVuY3kgPSBjdXJyZW5jeTtcblxuICAgICAgICAgICAgICAgICRzZXNzaW9uU3RvcmFnZS5jdXJyZW5jeSA9IGN1cnJlbmN5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgY29tcG9uZW50cy5jdXJyZW5jeS5hV0N1cnJlbmN5I2dldEN1cnJlbmN5XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBHZXRzIHRoZSB1c2VyJ3MgY3VycmVuY3kgY29kZSBmb3IgdGhlaXIgd2FsbGV0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEN1cnJlbmN5OiBmdW5jdGlvbiBnZXRDdXJyZW5jeSgpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbmN5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIGNvbnN0YW50XG4gKiBAbmFtZSBjdXJyZW5jeVN5bWJvbE1hcHBpbmdcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE9iamVjdCBvZiAzLWNoYXJhY3RlciBjdXJyZW5jeSBjb2RlcyBtYXBwaW5nIHRvIGN1cnJlbmN5IHN5bWJvbHMuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuY29uc3RhbnQoJ2N1cnJlbmN5U3ltYm9sTWFwcGluZycsIHtcbiAgICBHQlA6ICfCoycsXG4gICAgRVVSOiAn4oKsJyxcbiAgICBVU0Q6ICckJ1xufSk7IiwiLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgYVdhbGxldFxuICpcbiAqIEByZXF1aXJlcyAkc2Vzc2lvblN0b3JhZ2VcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNlcnZpY2UgdG8gZ2V0L3NldCB0aGUgdXNlcidzIHdhbGxldC5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuZmFjdG9yeSgnYVdhbGxldCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzZXNzaW9uU3RvcmFnZScsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNlc3Npb25TdG9yYWdlKXtcbiAgICAgICAgJHNlc3Npb25TdG9yYWdlLiRkZWZhdWx0KHtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczpbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1Zpc2l0ZWQgQmFuaycsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogJzI1JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKS8xMDAwIC0gNjAqNjAqN1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiAnLTUuMjAnLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpLzEwMDAgLSA2MCo2MCo2XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGlubmVyJyxcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiAnLTE1LjYwJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKS8xMDAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICAgKiBAbmFtZSBhbmdlbFdhbGxldC5hV2FsbGV0I3NhdmVUcmFuc2FjdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHRyYW5zYWN0aW9uIHtvYmplY3R9XG4gICAgICAgICAgICAgKiBAcGFyYW0gdHJhbnNhY3Rpb24uZGF0ZSB7bnVtYmVyfSBVbml4IHRpbWVzdGFtcCBvZiB0cmFuc2FjdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHRyYW5zYWN0aW9uLmRlc2NyaXB0aW9uIHtzdHJpbmd9IERlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBAcGFyYW0gdHJhbnNhY3Rpb24uYW1vdW50IHtzdHJpbmd9IFZhbHVlIG9mIHRyYW5zYWN0aW9uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBTYXZlcyB0cmFuc2FjdGlvbiB0byBzdG9yYWdlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNhdmVUcmFuc2FjdGlvbjogZnVuY3Rpb24gYWRkVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pe1xuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCBJIGRvbid0IG5lZWQgYW5ndWxhci5jb3B5KCkgaGVyZSBhcyBuZ1N0b3JhZ2UgdGFrZXMgY2FyZSBvZiB0aGF0IGZvciB1c1xuXG4gICAgICAgICAgICAgICAgJHNlc3Npb25TdG9yYWdlLnRyYW5zYWN0aW9ucy5wdXNoKHRyYW5zYWN0aW9uKTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ3RyYW5zYWN0aW9uLmFkZCcsIHRyYW5zYWN0aW9uKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgYW5nZWxXYWxsZXQuYVdhbGxldCNnZXRUcmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdFtdfSBBcnJheSBvZiB0cmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIEdldHMgdHJhbnNhY3Rpb24gZGF0YSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VHJhbnNhY3Rpb25zOiBmdW5jdGlvbiBnZXRUcmFuc2FjdGlvbnMoKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNlc3Npb25TdG9yYWdlLnRyYW5zYWN0aW9ucztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAgICogQG5hbWUgYW5nZWxXYWxsZXQuYVdhbGxldCNnZXRUcmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdFtdfSBBcnJheSBvZiB0cmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIEdldHMgdHJhbnNhY3Rpb24gZGF0YSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0QmFsYW5jZTogZnVuY3Rpb24gZ2V0QmFsYW5jZSgpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkc2Vzc2lvblN0b3JhZ2UudHJhbnNhY3Rpb25zLnJlZHVjZShmdW5jdGlvbihhY2N1bSwgdHJhbnNhY3Rpb24pe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gKyBwYXJzZUZsb2F0KHRyYW5zYWN0aW9uLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdSZWNvcmRUcmFuc2FjdGlvbkNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgICdhV2FsbGV0JyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbiwgYVdhbGxldCl7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICAgKiBAbmFtZSBkZXBvc2l0VHlwZVxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLmRlcG9zaXRUeXBlID0gJGxvY2F0aW9uLnNlYXJjaCgpLnR5cGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICAgKiBAbmFtZSB0cmFuc2FjdGlvblxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgc2F2ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogU2F2ZXMgdHJhbnNhY3Rpb24gYW5kIHJldHVybnMgdG8gdHJhbnNhY3Rpb24gbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKXtcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5kYXRlID0gTWF0aC5yb3VuZChEYXRlLm5vdygpLzEwMDApO1xuXG4gICAgICAgICAgICBpZigkc2NvcGUuZGVwb3NpdFR5cGUgPT09ICdwYXknKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50ID0gJHNjb3BlLnRyYW5zYWN0aW9uLmFtb3VudCAqIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhV2FsbGV0LnNhdmVUcmFuc2FjdGlvbigkc2NvcGUudHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb24udXJsKCcvJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgY2FuY2VsXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBSZXR1cm4gdG8gdHJhbnNhY3Rpb24gbG9nXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCl7XG4gICAgICAgICAgICAkbG9jYXRpb24udXJsKCcvJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHVuYmluZCA9ICRyb290U2NvcGUuJG9uKCckcm91dGVVcGRhdGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLmRlcG9zaXRUeXBlID0gJGxvY2F0aW9uLnNlYXJjaCgpLnR5cGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHVuYmluZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnKS5jb250cm9sbGVyKCdMb2dzQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgJ2FXYWxsZXQnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgYVdDdXJyZW5jeSwgYVdhbGxldCl7XG4gICAgICAgICRzY29wZS5zZXRDdXJyZW5jeSA9IGFXQ3VycmVuY3kuc2V0Q3VycmVuY3k7XG5cbiAgICAgICAgJHNjb3BlLmxvZ3MgPSBhV2FsbGV0LmdldFRyYW5zYWN0aW9ucygpO1xuICAgIH1cbl0pOyIsIi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgYVdCYWxhbmNlQ2hlY2tcbiAqXG4gKiBAcmVxdWlyZXMgYVdhbGxldFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVmFsaWRhdGlvbiBkaXJlY3RpdmUgdG8gZW5zdXJlIG5vbi1uZWdhdGl2ZSBiYWxhbmNlXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmRpcmVjdGl2ZSgnYVdCYWxhbmNlQ2hlY2snLCBbXG4gICAgJ2FXYWxsZXQnLFxuICAgIGZ1bmN0aW9uKGFXYWxsZXQpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZGVwb3NpdFR5cGU6ICc9YVdCYWxhbmNlQ2hlY2snXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKXtcbiAgICAgICAgICAgICAgICBjdHJsLiR2YWxpZGF0b3JzLmJhbGFuY2VDaGVjayA9IGZ1bmN0aW9uKG1vZGVsVmFsdWUsIHZpZXdWYWx1ZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGN0cmwuJGlzRW1wdHkobW9kZWxWYWx1ZSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhZGRpbmcgbW9uZXkgc28gYmFsYW5jZSB3aWxsIGluY3JlYXNlXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLmRlcG9zaXRUeXBlID09PSAnZGVwb3NpdCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdXNlcidzIGJhbGFuY2UgYW5kIHRoaXMgdHJhbnNhY3Rpb24gd2lsbCBrZWVwIHRoZSBiYWxhbmNlIG5vbi1uZWdhdGl2ZSB0aGVuIGl0IGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgIGlmKGFXYWxsZXQuZ2V0QmFsYW5jZSgpIC0gbW9kZWxWYWx1ZSA+PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW52YWxpZFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnZGVwb3NpdFR5cGUnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICBjdHJsLiR2YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=