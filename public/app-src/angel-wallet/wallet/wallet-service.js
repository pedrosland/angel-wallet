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
