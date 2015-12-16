$(function () {
    var strHtml = "<img src='http://cloud.metalsa.com/BusServiceMetalsa-war/ImagenMetalsa?personId=" + personId +
        "' class='img-responsive center-block'/>";
    $("#nombre").append(fullName);
    $("#user-img-b").append(strHtml);
    $.each(JSON.parse(permisos), function (i, item) {
        if (item.appId == 19) {
            $('#horariosFlexibles').css({'display': 'inline'});
            if (notificaciones > 0) {
                strHtml = "<div class='ntf-bubble'> <p>" + notificaciones + "</p></div>";;
                $("#notificaciones").append(strHtml);
            }
            $("#horasTrabajadas").append(horas + " hrs.");
        }
    });
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});
