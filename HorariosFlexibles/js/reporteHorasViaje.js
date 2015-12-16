$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' width=40 height=47  class='vcenter'/>";
    $("#user-th-pic").append(strHtml);
    cargaMenuHF();
    var strHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + "-115" + "/empleadosHF";
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
            $("#comboEmpleados").kendoComboBox({
                animation: false
            });
        });
    $("#comboEmpleados").change(function () {
        generaReporte($(this).val());
    });
    generaReporte(personId);
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});

function crearHoras() {
    location = "crearHorasViaje.html?personId=" + personId + "&fullName=" + fullName;
}

function generaReporte(personId) {
    var strHtml;
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId + "/horasViajeHF";
    $.getJSON(urlServ,
        function (data) {
            if (data.eventos != null) {
                $("#reporte").append("<tbody>");
                if (data.eventos != null) {
                    $.each(data.eventos, function (i, item) {
                        var evento = JSON.stringify({
                            fecha: item.fecha,
                            horas: item.horas,
                            estatus: item.estatus,
                            bancoId: item.bancoId,
                            autorizadoPor: item.autorizadoPor,
                            comentario: item.comentario
                        });
                        strHtml = "<tr><td>" + item.fecha + "</td><td>" + item.horas + "</td>" +
                            "<td>" + item.estatus + "</td><td>"+
                            "<button type='button' class='btn btn-default ver-detalle-btn mBlue_bg center-block' aria-label='Left Align'" +
                    		" onclick='verDetalle(" + evento + ")'> <span class='glyphicon glyphicon-list-alt'" +
                    		"aria-hidden='true'></span></button>"+
                            "</td></tr>";
                        $("#reporte").append(strHtml);
                    });
                }
            }
            $("#reporte").append("</tbody>");
        });
    $("#reporte").kendoGrid();
}

function verDetalle(evento) {
    if (evento.autorizadoPor == 0) {
        evento.autorizadoPor = "Sin procesar";
    }
    var strHtml = "<tr class='dtl'><td>Fecha</td><td>" + evento.fecha + "</td></tr>" +
        "<tr class='dtl'><td>Horas</td><td>" + evento.horas + "</td></tr>" +
        "<tr class='dtl'><td>Estatus</td><td>" + evento.estatus + "</td></tr>" +
        "<tr class='dtl'><td>Comentario</td><td>" + evento.comentario + "</td></tr>" +
        "<tr class='dtl'><td>Procesado por</td><td>" + evento.autorizadoPor + "</td></tr>";
    $(".dtl").remove();
    $("#detalle").append(strHtml);
    if ($("#comboEmpleados").val() != personId && evento.autorizadoPor == "Sin procesar") {
        var fechaActual = new Date();
        $("#dlgDetalle").dialog({
            modal: true,
            buttons: {
                Aprobar: function () {
                    var data = JSON.stringify({
                        bancoId: evento.bancoId,
                        fecha: $.formateaFecha(fechaActual),
                        estatusId: 2,
                        personId: personId
                    });
                    procesaHoras(data);
                },
                Rechazar: function () {
                    var data = JSON.stringify({
                        bancoId: evento.bancoId,
                        fecha: $.formateaFecha(fechaActual),
                        estatusId: 3,
                        personId: personId
                    });
                    procesaHoras(data);
                }
            }
        });
    } else {
        $("#dlgDetalle").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    }
}

function procesaHoras(data) {
    var strMensaje;
    $.ajax({
        url: "http://cloud.metalsa.com/BusServiceMetalsa-war/service/procesarHorasViajeHF",
        method: "POST",
        contentType: "application/json",
        data: data,
        dataType: "json"
    }).done(function (data) {
        if (data.statusEvento == true) {
            strMensaje = 'Evento creado. ';
        } else {
            strMensaje = 'Evento no creado. ';
        }
        if (data.statusEvento == true) {
            var dir = "reportePersonal.html?personId=" + personId + "&fullName=" + fullName;
            muestraMensajeEvento(2, strMensaje, "#dlgMessage", dir);
        } else {
            muestraMensaje(1, strMensaje, "#dlgMessage");
        }
    }).fail(function (jqXHR, textStatus) {
        muestraMensaje(1, "Error en el servidor", "#dlgMessage");
    });
}