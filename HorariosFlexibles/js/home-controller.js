angular.module('portalMetalsa.controllers')

.controller("homeController", function ($scope, $http, GlobalVariables) {
    $scope.nombreEmp = GlobalVariables.fullName;
    $scope.srcImgUsr = "http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + GlobalVariables.personId;
    $scope.displayHF = 'none';
    $scope.displayNoti = 'none';
    $.each(GlobalVariables.permisos, function (i, item) {
        if (item.appId == 19) {
            var fecha = $.getLunes();
            var lunes = $.formateaFechaNumerico(fecha);
            fecha.setDate(fecha.getDate() + 6)
            var domingo = $.formateaFechaNumerico(fecha);
            $scope.displayHF = 'inline';
            var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + GlobalVariables.personId +
                "/fechaInicio/" + lunes + "/fechaFin/" + domingo + "/horasNotificacionesHF";
            $http.get(urlServ)
                .success(function (data, status) {
                    $scope.horasTrabajadas = (data.horas != null ? data.horas : GlobalVariables.horas) + " hrs.";
                    $scope.notificaciones = data.notificaciones != null ? data.notificaciones : GlobalVariables.notificaciones;
                    if ($scope.notificaciones > 0) {
                        $scope.displayNoti = 'inline';
                    }
                }).error(function (jqXHR, textStatus) {
                    alert('error en el servidor');
                })
        }
    });
    $scope.horariosFlexibles = function () {
        location = '#/reportePersonal';
    };
});