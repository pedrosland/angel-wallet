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
angular.module('components.navigation', []);
angular.module('components.navigation').controller('NavigationController', [
    '$scope',
    function($scope){
        $scope.isCollapsed = true;

        /**
         * Reset the data in storage and refresh the page
         */
        $scope.reset = function reset(){

        }
    }
]);
angular.module('angelWallet').controller('WalletController', [
    '$scope',
    function($scope){

    }
]);
angular.module('angelWallet').controller('LogsController', [
    '$scope',
    function($scope){
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
        ]
    }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ2VsLXdhbGxldC9hbmdlbC13YWxsZXQuanMiLCJjb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvd2FsbGV0LWNvbnRyb2xsZXIuanMiLCJhbmdlbC13YWxsZXQvbG9ncy9sb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmdlbC13YWxsZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYW5nZWxXYWxsZXQnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ2NvbXBvbmVudHMubmF2aWdhdGlvbiddKVxuICAgIC5jb25maWcoW1xuICAgICAgICAnJHJvdXRlUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9nc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gSlMgYW5kIGluamVjdGVkIGluXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC1zcmMvYW5nZWwtd2FsbGV0L2xvZ3MvbG9ncy5odG1sJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuICAgICAgICB9XG4gICAgXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbXBvbmVudHMubmF2aWdhdGlvbicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnY29tcG9uZW50cy5uYXZpZ2F0aW9uJykuY29udHJvbGxlcignTmF2aWdhdGlvbkNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXQgdGhlIGRhdGEgaW4gc3RvcmFnZSBhbmQgcmVmcmVzaCB0aGUgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKXtcblxuICAgICAgICB9XG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignV2FsbGV0Q29udHJvbGxlcicsIFtcbiAgICAnJHNjb3BlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUpe1xuXG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FuZ2VsV2FsbGV0JykuY29udHJvbGxlcignTG9nc0NvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgJHNjb3BlLmxvZ3MgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdMdW5jaCcsXG4gICAgICAgICAgICAgICAgYW1vdW50OiAnNS4yMCcsXG4gICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKSAtIDMwMDAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGlubmVyJyxcbiAgICAgICAgICAgICAgICBhbW91bnQ6ICcxNS44MCcsXG4gICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5ub3coKVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9