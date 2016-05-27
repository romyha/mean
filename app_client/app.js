angular.module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);    //ngRoute as module dependency

function config($routeProvider, $locationProvider) {   //hold route definitions
    $routeProvider.when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
    }).when('/about', {
        templateUrl: '/common/views/genericText.view.html',
        controller: 'aboutCtrl',
        controllerAs: 'vm'
    }).when('/location/:locationid', {
        templateUrl: '/locationDetail/locationDetail.view.html',
        controller: 'locationDetailCtrl',
        controllerAs: 'vm'
    }).otherwise({ redirectTo: '/' });
    
    $locationProvider.html5Mode({
        enabled: true,
        reqiureBase: false
    });
}


angular.module('loc8rApp').config(['$routeProvider', '$locationProvider', config]);   //add config to module, passing $routeProvider as dependency
