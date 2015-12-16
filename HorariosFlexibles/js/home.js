$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' class='img-responsive center-block'/>";
    $("#nombre").append(fullName);
    $("#user-img-b").append(strHtml);
    $.each(JSON.parse(permisos), function (i, item) {
        if (item.appId == 19) {
            var fecha = $.getLunes();
            var lunes = $.formateaFechaNumerico(fecha);
            fecha.setDate(fecha.getDate() + 6)
            var domingo = $.formateaFechaNumerico(fecha);
            $('#horariosFlexibles').css({
                'display': 'inline'
            });
            var urlServ = "http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/" + personId +
                "/fechaInicio/" + lunes + "/fechaFin/" + domingo + "/horasNotificacionesHF";
            $.getJSON(urlServ,
                function (data) {
                    $("#horasTrabajadas").append((data.horas != null ? data.horas : horas) + " hrs.");
                    var noti = data.notificaciones != null ? data.notificaciones : notificaciones;
                    if (noti > 0) {
                        strHtml = "<div class='ntf-bubble'> <p>" + notificaciones + "</p></div>";;
                        $("#notificaciones").append(strHtml);
                    }
                });
        }
    });
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});