angular.module('portalMetalsa.controllers')

.controller("reportePersonalController", function ($scope, $http, GlobalVariables) {
    cargaMenuHF(GlobalVariables.permisos);
    $("#reporte").kendoGrid();
    $scope.generaReporte = function (fechaInicial, fechaFinal) {
        var srtHtml;
        var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + GlobalVariables.personId +
            "/fechaInicio/" + fechaInicial + "/fechaFin/" + fechaFinal + "/reportePersonalHF";
        $http.get(urlServ)
            .success(function (data, status) {
            alert(data.dias);
                $scope.totalHoras = data.totalHoras;
           		$scope.detalle = data.dias;
            }).error(function (jqXHR, textStatus) {
                alert('error en el servidor');
            })
    };

    $scope.actualizaReporte = function () {
        $(".repDia").remove();
        var fechaIni = $.replaceAll($scope.fechaInicial, "/", "");
        var fechaFin = $.replaceAll($scope.fechaFinal, "/", "");
        $scope.generaReporte(fechaIni, fechaFin);
    }


    $scope.verDetalle = function(fecha) {
        var strHtml;
        var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + GlobalVariables.personId +
            "/fecha/" + fecha + "/detalleDiaHF";
        $(".dtlDia").remove();
        var strHead = "<thead><tr class='dtlDia'><th class='etiqueta'>Hora</th><th class='etiqueta'>Tipo Evento</th>" +
            "<th class='etiqueta'>Descripcion</th></tr></thead>";
        $("#reporteDia").append(strHead);
        $.getJSON(urlServ,
            function (data) {
                if (data.eventos != null) {
                    $("#reporteDia").append("<tbody class='dtlDia'>");
                    $.each(data.eventos, function (i, item) {
                        strHtml = "<tr class='dtlDia'><td class='textoEtiqueta'>" + item.fecha + "</td><td class='textoEtiqueta'>" 
                            + item.lector + "</td><td class='textoEtiqueta'>" + item.evento + "</td></tr>";
                        $("#reporteDia").append(strHtml);
                    });
                    $("#reporteDia").append("</tbody>");
                }
            });
        $("#dlgDetalleDia").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    $scope.srcImgUsr = "http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + GlobalVariables.personId;
    var fecha = $.getLunes();
    $("#fechaInicial").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: fecha,
        animation: false
    });
    var lunes = $.formateaFechaNumerico(fecha);
    fecha.setDate(fecha.getDate() + 6);
    $("#fechaFinal").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: fecha,
        animation: false
    });
    var domingo = $.formateaFechaNumerico(fecha);
    $scope.detalle = [{fechaF: '', horas: '', fecha: ''}];
    $scope.generaReporte(lunes, domingo);
});