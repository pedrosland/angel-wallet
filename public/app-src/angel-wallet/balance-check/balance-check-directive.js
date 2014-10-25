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