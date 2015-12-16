$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' width=40 height=47  class='vcenter'/>";
    $("#user-th-pic").append(strHtml);
    cargaMenuHF();
    var strHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId + "/empleadosHF";
    $("#nombre").append(fullName);
    $.getJSON(urlServ,
        function (data) {
            strHtml = "<option value='" + personId + "'>" + fullName + "</option>";
            $("#comboEmpleados").append(strHtml);
            if (data.empleados != null) {
                $.each(data.empleados, function (i, item) {
                    strHtml = "<option value='" + item.personId + "'>" + item.fullName + "</option>";
                    $("#comboEmpleados").append(strHtml);
                });
            }
            $("#comboEmpleados").val(personId);
            $("#comboEmpleados").kendoComboBox();
        });
    $("#comboEmpleados").change(function () {
        generaReporte($(this).val());
    });
    generaReporte(personId);
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});

function generaReporte(personId) {
    var strHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId + "/eventosPersonaHF";
    $.getJSON(urlServ,
        function (data) {
            $("#reporte").append("<tbody>");
            if (data.eventos != null) {
                $.each(data.eventos, function (i, item) {
                    strHtml = "<tr><td>" + item.fecha + "</td><td>" + item.evento + "</td>" +
                        "<td>" + item.horas + "</td><td>" + item.comentario + "</td></tr>";
                    $("#reporte").append(strHtml);
                });
            }
            $("#reporte").append("</tbody>");

        });
    $("#reporte").kendoGrid();
}