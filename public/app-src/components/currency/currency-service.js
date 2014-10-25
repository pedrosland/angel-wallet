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