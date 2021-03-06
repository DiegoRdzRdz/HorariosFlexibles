$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' width=40 height=47  class='vcenter'/>";
    cargaMenuHF();
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
    $("#user-th-pic").append(strHtml);
    var fecha = $.getLunes();
    $("#nombre").append(fullName);
    $("#fechaInicial").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: fecha
    });
    var lunes = $.formateaFechaNumerico(fecha);
    fecha.setDate(fecha.getDate() + 6);
    $("#fechaFinal").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: fecha
    });
    var domingo = $.formateaFechaNumerico(fecha);
    generaReporte(lunes, domingo, personId);
});

function actualizaReporte(form) {
    var fechaInicial = form.fechaInicial.value;
    var fechaFinal = form.fechaFinal.value;
    $(".repEmpleado").remove();
    $("#totalHorasLbl").remove();
    fechaInicial = $.replaceAll(fechaInicial, "/", "");
    fechaFinal = $.replaceAll(fechaFinal, "/", "");
    generaReporte(fechaInicial, fechaFinal, personId);
}

function generaReporte(fechaInicial, fechaFinal, personId) {
    var srtHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId +
        "/fechaInicio/" + fechaInicial + "/fechaFin/" + fechaFinal + "/reporteEmpleadosHF";
    $.getJSON(urlServ,
        function (data) {
            $("#totalHoras").append("<label id='totalHorasLbl'>" + data.totalHoras + "</label>");
            $("#reporte").append("<tbody class='repEmpleado'>");
            if (data.empleados != null) {
                $.each(data.empleados, function (i, item) {
                    srtHtml = "<tr><td>" + item.fullName + "</td>" + "<td>" + item.horas + "</td>" +
                        "<td><button type='button' class='btn btn-default ver-detalle-btn mBlue_bg center-block' aria-label='Left Align'" +
                        " onclick='verDetalle(" + fechaInicial + "," + fechaFinal + "," + item.personId + 
                        ")'> <span class='glyphicon glyphicon-list-alt'" + "aria-hidden='true'></span></button></td></tr>";
                    $("#reporte").append(srtHtml);
                });
            }
            $("#reporte").append("</tbody>");
        });
    $("#reporte").kendoGrid();
}

function select() {
    var selected = $.map(this.select(), function (item) {
        return $(item).text();
    }) + '';
    var personId = selected.split(",")[0];
    var fechaInicial = $("#fechaInicial").val();
    var fechaFinal = $("#fechaFinal").val();
    $(".repEmpleado").remove();
    $("#totalHorasLbl").remove();
    fechaInicial = $.replaceAll(fechaInicial, "/", "");
    fechaFinal = $.replaceAll(fechaFinal, "/", "");
    generaReporte(fechaInicial, fechaFinal, personId);
}

function verDetalle(fechaInicial, fechaFinal, personIdEmp) {
    var srtHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personIdEmp +
        "/fechaInicio/" + fechaInicial + "/fechaFin/" + fechaFinal + "/reportePersonalHF";
    $(".dtlEmpleado").remove();
    var strHead = "<thead><tr class='dtlEmpleado'><th class='etiqueta'>Fecha</th><th class='etiqueta'>Horas</th>" +
        			"<th class='etiqueta'>Detalle</th></tr></thead>";
    $("#reporteEmpleado").append(strHead);
    $.getJSON(urlServ,
        function (data) {
            if (data.dias != null) {
                $("#reporteEmpleado").append("<tbody class='dtlEmpleado'>");
                $.each(data.dias, function (i, item) {
                    srtHtml = "<tr><td style='width: 90px' class='textoEtiqueta'>" + item.fechaF + "</td><td style='width: 70px' class='textoEtiqueta'>" + item.horas + "</td>" +
                        "<td><input type='button' style='width: 85px' class='ver-detalle-btn-mini  center-block' value='Detalle' " +
                        "onclick='verDetalleDia(" + item.fecha + "," + item.personId + ")'/></td></tr>";
                    $("#reporteEmpleado").append(srtHtml);
                });
                $("#reporteEmpleado").append("</tbody>");
            }
        });
    $("#dlgDetalleEmpleado").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
}

function verDetalleDia(fecha, personIdEmp) {
    var srtHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personIdEmp +
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
                    srtHtml = "<tr><td class='textoEtiqueta'>" + item.fecha + "</td><td class='textoEtiqueta'>" + item.lector + "</td>" +
                        "<td class='textoEtiqueta'>" + item.evento + "</td></tr>";
                    $("#reporteDia").append(srtHtml);
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