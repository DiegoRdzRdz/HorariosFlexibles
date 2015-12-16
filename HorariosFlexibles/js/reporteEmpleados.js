$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' width=40 height=47  class='vcenter'/>";
    cargaMenuHF();
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
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
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
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + 13572 +
        "/fechaInicio/" + fechaInicial + "/fechaFin/" + fechaFinal + "/reporteEmpleadosHF";
    $.getJSON(urlServ,
        function (data) {
            $("#totalHoras").append("<label id='totalHorasLbl'>" + data.totalHoras + "</label>");
            $("#reporte").append("<tbody class='repDia'>");
            if (data.empleados != null) {
                $.each(data.empleados, function (i, item) {
                    srtHtml = "<tr><td  style='display:none;'>" + item.personId + ",</td><td>" + item.employeeId +
                        "</td><td>" + item.fullName + "</td>" + "<td>" + item.horas + "</td>" +
                        "<td><input type='button' value='Ver detalle' onclick='verDetalle(" +
                        fechaInicial + "," + fechaFinal + "," + item.personId + ")'/></td></tr>";
                    $("#reporte").append(srtHtml);
                });
            }
            $("#reporte").append("</tbody>");
        });
    $("#reporte").kendoGrid({
        selectable: true,
        change: select
    });
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
    var strHead = "<tr class='dtlEmpleado'><td>Fecha</td><td>Horas</td><td>Detalle</td></tr>";
    $("#reporteEmpleado").append(strHead);
    $.getJSON(urlServ,
        function (data) {
            if (data.dias != null) {
                $.each(data.dias, function (i, item) {
                    srtHtml = "<tr class='dtlEmpleado'><td>" + item.fechaF + "</td><td>" + item.horas + "</td>" +
                        "<td><input type='button' value='Ver detalle' onclick='verDetalleDia(" +
                        item.fecha + "," + personIdEmp + ")'/></td></tr>";
                    $("#reporteEmpleado").append(srtHtml);
                });
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
    var eventos;
    var srtHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personIdEmp +
        "/fecha/" + fecha + "/detalleDiaHF";
    $(".dtlDia").remove();
    var strHead = "<tr class='dtlDia'><td>Hora</td><td>Tipo Evento</td><td>Descripcion</td></tr>";
    $("#reporteDia").append(strHead);
    $.getJSON(urlServ,
        function (data) {
            $.each(data, function (key, val) {
                if (key == 'eventos') {
                    eventos = val;
                }
            });
            $.each(eventos, function (i, item) {
                srtHtml = "<tr class='dtlDia'><td>" + item.fecha + "</td><td>" + item.lector + "</td>" +
                    "<td>" + item.evento + "</td></tr>";
                $("#reporteDia").append(srtHtml);
            });
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