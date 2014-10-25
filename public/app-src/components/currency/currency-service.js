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