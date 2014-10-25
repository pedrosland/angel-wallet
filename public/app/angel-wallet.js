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
angular.module('angelWallet').factory('aWallet', [
    '$localStorage',
    function($localStorage){
        
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LmpzIiwiY29tcG9uZW50cy9uYXYtbGluay9uYXYtbGluay5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24tY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbmF2LWxpbmsvbmF2LWxpbmstZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9jdXJyZW5jeS9jdXJyZW5jeS1maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5L2N1cnJlbmN5LXN5bWJvbC1tYXBwaW5nLWNvbnN0YW50LmpzIiwiYW5nZWwtd2FsbGV0L3dhbGxldC93YWxsZXQtc2VydmljZS5qcyIsImFuZ2VsLXdhbGxldC9yZWNvcmQtdHJhbnNhY3Rpb24vcmVjb3JkLXRyYW5zYWN0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsICdjb21wb25lbnRzLm5hdkxpbmsnLCAnY29tcG9uZW50cy5jdXJyZW5jeSddKVxuICAgIC5jb25maWcoW1xuICAgICAgICAnJHJvdXRlUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9nc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gSlMgYW5kIGluamVjdGVkIGluXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L2xvZ3MvbG9ncy5odG1sJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9wYXknLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvcmVjb3JkP3R5cGU9cGF5J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9kZXBvc2l0Jywge1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3JlY29yZD90eXBlPWRlcG9zaXQnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL3JlY29yZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlY29yZFRyYW5zYWN0aW9uQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L3JlY29yZC10cmFuc2FjdGlvbi9yZWNvcmQtdHJhbnNhY3Rpb24uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuICAgICAgICB9XG4gICAgXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMuY3VycmVuY3knLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2TGluaycsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZpZ2F0aW9uJywgW10pOyIsIi8qKlxuICogQG5nZG9jIGNvbnRyb2xsZXJcbiAqIEBuYW1lIGNvbXBvbmVudHMubmF2aWdhdGlvbjpOYXZpZ2F0aW9uQ29udHJvbGxlclxuICpcbiAqIEByZXF1aXJlcyBhV0N1cnJlbmN5XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBdHRhY2ggdG8gYSBsaW5rICg8YT4pIGFuZCBpdCB3aWxsIHVwZGF0ZSBwYXJlbnQgZWxlbWVudCB3aXRoIFwiYWN0aXZlXCIgY2xhc3NcbiAqIGlmIHRoZSBocmVmIG9mIHRoZSBsaW5rIG1hdGNoZXMgdGhlIGN1cnJlbnQgcm91dGUuIE5vdGUgdGhhdCB0aGlzIHByb2JhYmx5XG4gKiB3b24ndCB3b3JrIHdpdGggSFRNTDUgcm91dGluZy5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicpLmNvbnRyb2xsZXIoJ05hdmlnYXRpb25Db250cm9sbGVyJywgW1xuICAgICckc2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgICckbG9jYWxTdG9yYWdlJyxcbiAgICAnYVdDdXJyZW5jeScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRsb2NhbFN0b3JhZ2UsIGFXQ3VycmVuY3kpe1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAgICogQG5hbWUgaXNDb2xsYXBzZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFNldCB0byBgdHJ1ZWAgaWYgdGhlIG1lbnUgaXMgY29sbGFwc2VkXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lIHJlc2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBSZXNldCB0aGUgZGF0YSBpbiBzdG9yYWdlIGFuZCByZWZyZXNoIHRoZSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpe1xuICAgICAgICAgICAgJGxvY2FsU3RvcmFnZS4kcmVzZXQoKTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5ocmVmKCcvJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICogQG5hbWUgZ2V0Q3VycmVuY3lDbGFzc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogR2V0IGN1cnJlbnQgRm9udEF3ZXNvbWUgY2xhc3MgdG8gdXNlIGZvciBtZW51XG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuZ2V0Q3VycmVuY3lDbGFzcyA9IGZ1bmN0aW9uIGdldEN1cnJlbmN5Q2xhc3MoKXtcbiAgICAgICAgICAgIHJldHVybiAnZmEtJyArIGFXQ3VycmVuY3kuZ2V0Q3VycmVuY3koKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB3YU5hdkxpbmtcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEF0dGFjaCB0byBhIGxpbmsgKDxhPikgYW5kIGl0IHdpbGwgdXBkYXRlIHBhcmVudCBlbGVtZW50IHdpdGggXCJhY3RpdmVcIiBjbGFzc1xuICogaWYgdGhlIGhyZWYgb2YgdGhlIGxpbmsgbWF0Y2hlcyB0aGUgY3VycmVudCByb3V0ZS4gTm90ZSB0aGF0IHRoaXMgcHJvYmFibHlcbiAqIHdvbid0IHdvcmsgd2l0aCBIVE1MNSByb3V0aW5nLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZMaW5rJykuZGlyZWN0aXZlKCd3YU5hdkxpbmsnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckbG9jYXRpb24nLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiByb3V0ZUNoYW5nZUxpc3RlbmVyKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGF0dHJzLmhyZWYgPT09ICcjJyArICRsb2NhdGlvbi51cmwoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB1bmJpbmQgPSAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCByb3V0ZUNoYW5nZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB1bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuZmlsdGVyKCdjdXJyZW5jeUNvZGVUb1N5bWJvbCcsIFtcbiAgICAnY3VycmVuY3lTeW1ib2xNYXBwaW5nJyxcbiAgICBmdW5jdGlvbihjdXJyZW5jeVN5bWJvbE1hcHBpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW5jeVN5bWJvbE1hcHBpbmdbY29kZV07XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSBhV0N1cnJlbmN5XG4gKlxuICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNlcnZpY2UgdG8gZ2V0L3NldCB0aGUgdXNlcidzIGN1cnJlbmN5IHByZWZlcmVuY2UuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdjb21wb25lbnRzLmN1cnJlbmN5JykuZmFjdG9yeSgnYVdDdXJyZW5jeScsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSl7XG4gICAgICAgIC8vIFNldCBzaW5jZSB3ZSBkb24ndCB5ZXQgaGF2ZSBhIHBlcnNpc3RlbmNlIGxheWVyXG4gICAgICAgICRyb290U2NvcGUuY3VycmVuY3kgPSAnR0JQJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICAgKiBAbmFtZSBjb21wb25lbnRzLmN1cnJlbmN5LmFXQ3VycmVuY3kjc2V0Q3VycmVuY3lcbiAgICAgICAgICAgICAqIEBwYXJhbSBjdXJyZW5jeSB7c3RyaW5nfSAzLWNoYXJhY3RlciBjdXJyZW5jeSBjb2RlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBQZXJzaXN0cyBjdXJyZW5jeSBjb2RlIGFuZCBzZXRzIGl0IG9uICRyb290U2NvcGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0Q3VycmVuY3k6IGZ1bmN0aW9uIHNldEN1cnJlbmN5KGN1cnJlbmN5KXtcbiAgICAgICAgICAgICAgICAvLyBVc2luZyAkcm9vdFNjb3BlIGFzIGl0IHdpbGwgYmUgaW5jbHVkZWQgdGhyb3VnaG91dCB0aGUgZW50aXJlIGFwcC5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbmN5ID0gY3VycmVuY3k7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICAgKiBAbmFtZSBjb21wb25lbnRzLmN1cnJlbmN5LmFXQ3VycmVuY3kjZ2V0Q3VycmVuY3lcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIEdldHMgdGhlIHVzZXIncyBjdXJyZW5jeSBjb2RlIGZvciB0aGVpciB3YWxsZXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0Q3VycmVuY3k6IGZ1bmN0aW9uIGdldEN1cnJlbmN5KCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRyb290U2NvcGUuY3VycmVuY3k7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCIvKipcbiAqIEBuZ2RvYyBjb25zdGFudFxuICogQG5hbWUgY3VycmVuY3lTeW1ib2xNYXBwaW5nXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBPYmplY3Qgb2YgMy1jaGFyYWN0ZXIgY3VycmVuY3kgY29kZXMgbWFwcGluZyB0byBjdXJyZW5jeSBzeW1ib2xzLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5jdXJyZW5jeScpLmNvbnN0YW50KCdjdXJyZW5jeVN5bWJvbE1hcHBpbmcnLCB7XG4gICAgR0JQOiAnwqMnLFxuICAgIEVVUjogJ+KCrCcsXG4gICAgVVNEOiAnJCdcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmZhY3RvcnkoJ2FXYWxsZXQnLCBbXG4gICAgJyRsb2NhbFN0b3JhZ2UnLFxuICAgIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2Upe1xuICAgICAgICBcbiAgICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhbmdlbFdhbGxldCcpLmNvbnRyb2xsZXIoJ1JlY29yZFRyYW5zYWN0aW9uQ29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGxvY2F0aW9uJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbil7XG4gICAgICAgICRzY29wZS50cmFuc2FjdGlvbiA9IHt9O1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gc2F2ZSgpe1xuICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmRhdGUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICBpZigkbG9jYXRpb24uc2VhcmNoKCd0eXBlJykgPT09ICdwYXknKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uYW1vdW50ID0gJy0nICsgJHNjb3BlLnRyYW5zYWN0aW9uLmFtb3VudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnRyYW5zYWN0aW9uKTtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCl7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignTG9nc0NvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ2FXQ3VycmVuY3knLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgYVdDdXJyZW5jeSl7XG4gICAgICAgICRzY29wZS5zZXRDdXJyZW5jeSA9IGFXQ3VycmVuY3kuc2V0Q3VycmVuY3k7XG5cbiAgICAgICAgJHNjb3BlLmxvZ3MgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdMdW5jaCcsXG4gICAgICAgICAgICAgICAgYW1vdW50OiAnNS4yMCcsXG4gICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKSAtIDMwMDAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGlubmVyJyxcbiAgICAgICAgICAgICAgICBhbW91bnQ6ICcxNS44MCcsXG4gICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cbl0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==