angular.module('portalMetalsa', ['portalMetalsa.controllers', 'portalMetalsa.services', 'ngRoute', 'kendo.directives'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
            controller: 'loginController',
 
        })
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController',
        })
        .when('/reportePersonal', {
            templateUrl: 'reportePersonal.html',
            controller: 'reportePersonalController',
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
angular.module('portalMetalsa.controllers', []);

angular.module('portalMetalsa.services', []);