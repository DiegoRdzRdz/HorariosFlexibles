$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' width=40 height=47  class='vcenter'/>";
    $("#user-th-pic").append(strHtml);
    cargaMenuHF();
    var fecha = $.getLunes();
    $("#nombre").append(fullName);
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
    generaReporte(lunes, domingo);
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});

function actualizaReporte(form) {
    var fechaInicial = form.fechaInicial.value;
    var fechaFinal = form.fechaFinal.value;
    $(".repDia").remove();
    $("#totalHorasLbl").remove();
    fechaInicial = $.replaceAll(fechaInicial, "/", "");
    fechaFinal = $.replaceAll(fechaFinal, "/", "");
    generaReporte(fechaInicial, fechaFinal);
}

function generaReporte(fechaInicial, fechaFinal) {
    var srtHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId +
        "/fechaInicio/" + fechaInicial + "/fechaFin/" + fechaFinal + "/reportePersonalHF";
    $.getJSON(urlServ,
        function (data) {
            $("#totalHoras").append("<label id='totalHorasLbl'>" + data.totalHoras + "</label>");
            $("#reporte").append("<tbody class='repDia'>");
            $.each(data.dias, function (i, item) {
                srtHtml = "<tr><td>" + item.fechaF + "</td><td>" + item.horas + "</td>" +
                    "<td><button type='button' class='btn btn-default ver-detalle-btn mBlue_bg center-block' aria-label='Left Align'" +
                    " onclick='verDetalle(" + item.fecha + ")'> <span class='glyphicon glyphicon-list-alt'" +
                    "aria-hidden='true'></span></button></td></tr>";
                $("#reporte").append(srtHtml);
            });
            $("#reporte").append("</tbody>");
        });
    $("#reporte").kendoGrid();
}

function verDetalle(fecha) {
    var strHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId +
        "/fecha/" + fecha + "/detalleDiaHF";
    $(".dtlDia").remove();
    var strHead = "<tr class='dtlDia'><td>Hora</td><td>Tipo Evento</td><td>Descripcion</td></tr>";
    $("#reporteDia").append(strHead);
    $.getJSON(urlServ,
        function (data) {
            if (data.eventos != null) {
                $.each(data.eventos, function (i, item) {
                    strHtml = "<tr class='dtlDia'><td>" + item.fecha + "</td><td>" + item.lector + "</td>" +
                        "<td>" + item.evento + "</td></tr>";
                    $("#reporteDia").append(strHtml);
                });
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
    $("#reporteDia").kendoGrid();
}