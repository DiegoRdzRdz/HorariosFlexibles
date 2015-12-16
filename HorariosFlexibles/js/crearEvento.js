$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' width=40 height=47  class='vcenter'/>";
    cargaMenuHF();
    $("#user-th-pic").append(strHtml);
    var fecha = new Date();
    $("#horasSolicitadas").val("0");
    $("#minutosSolicitados").val("0");
    $("#fechaInicial").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: fecha
    });
    $("#horasSolicitadas").kendoNumericTextBox({
        format: "n0"
    });
    $("#minutosSolicitados").kendoNumericTextBox({
        format: "n0"
    });
    var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId + "/eventoTipoPersonaHF";
    $.getJSON(urlServ,
        function (data) {
            if (data.eventos != null) {
                $.each(data.eventos, function (i, item) {
                    strHtml = "<option value='" + item.id + "," + item.horas + "," + item.banco + "," + item.minutosDisponibles +
                        "'>" + item.descripcion + "</option>";
                    $("#comboEvento").append(strHtml);
                });
            }
            $("#comboEvento").kendoComboBox();
        });
    $("#comboEvento").change(function () {
        var valores = $(this).val().split(",");
        if (valores[2] == 1) {
            $("#horasDisponibles").val(valores[1]);
        } else {
            $("#horasDisponibles").val("");
        }
    });
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});

function crearEvento() {
    var valores = $("#comboEvento option:selected").val().split(",");
    var minutosSolicitados = (parseInt($("#horasSolicitadas").val()) * 60) + parseInt($("#minutosSolicitados").val());
    var minutosDisponibles = valores[3];
    if ($("#comboEvento option:selected").val() == 0) {
        muestraMensaje(1, "No has seleccionado tipo de evento", "#dlgMessage");
    } else if (minutosSolicitados == 0) {
        muestraMensaje(1, "No has capturado el tiempo solicitados", "#dlgMessage");
    } else if (valores[2] == 1 && minutosSolicitados > minutosDisponibles) {
        muestraMensaje(1, "No puedes solicitar mas tiempo que el de tu banco de horas", "#dlgMessage");
    } else {
        var fechaActual = new Date();
        var strMensaje;
        var data = JSON.stringify({
            comentarios: $('#comentarios').val(),
            fechaAlta: $.formateaFecha(fechaActual),
            fechaEvento: $("#fechaInicial").val(),
            minutosSeleccionados: minutosSolicitados,
            tipoEvento: valores[0],
            personId: personId,
            nombreEvento: $("#comboEvento option:selected").text()
        });
        $.ajax({
            url: "http://cloud.metalsa.com/BusServiceMetalsa-war/service/crearEvento",
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
            if (data.statusMail == true) {
                strMensaje = strMensaje + 'Mail enviado.';
            } else {
                strMensaje = strMensaje + 'Mail no enviado.';
            }
            if (data.statusEvento == true) {
                muestraMensajeEvento(2, strMensaje, "#dlgMessage", "reportePersonal");
            } else {
                muestraMensaje(1, strMensaje, "#dlgMessage");
            }
        }).fail(function (jqXHR, textStatus) {
            muestraMensaje(1, "Error en el servidor", "#dlgMessage");
        });
    }
}