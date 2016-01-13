angular.module('portalMetalsa.controllers')

.controller("loginController", function ($scope, $http, GlobalVariables) {
    $scope.login = function () {
        var fecha = $.getLunes();
        var lunes = $.formateaFechaNumerico(fecha);
        fecha.setDate(fecha.getDate() + 6)
        var domingo = $.formateaFechaNumerico(fecha);
        var data = {
            usuario: $scope.email,
            password: $scope.pwd,
            fechaInicio: lunes,
            fechaFin: domingo
        };
        $http.post("http://cloud.metalsa.com/BusServiceMetalsa-war/service/autenticar", data)
            .success(function (data, status) {
                if (data.userValid == 'true') {
                    GlobalVariables.personId = data.employeeID;
                    GlobalVariables.fullName = data.fullName;
                    GlobalVariables.horas = data.horas;
                    GlobalVariables.notificaciones = data.notificaciones;
                    GlobalVariables.permisos = data.permisos;
                    location = '#/home';
                } else {
                    alert('credenciales invalidas');
                }
            }).error(function (jqXHR, textStatus) {
                alert('error en el servidor');
            })
    };
});