angular.module('angelWallet', ['ngRoute', 'ui.bootstrap', 'components.navigation'])
    .config([
        '$routeProvider',
        function($routeProvider){
            $routeProvider
                .when('/', {
                    controller: 'LogsController',
                    // This should be converted to JS and injected in
                    templateUrl: '/app-src/angel-wallet/logs/logs.html'
                })
                .otherwise('/');
        }
    ]);