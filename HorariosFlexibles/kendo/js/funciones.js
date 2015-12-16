$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}
$.replaceAll = function (cadena, anterior, nuevo) {
    var re = new RegExp(anterior, 'g');
    return cadena.replace(re, nuevo);
}
$.getLunes = function () {
    var fecha = new Date();
    var day = fecha.getDay() || 7;
    if (day !== 1) {
        fecha.setHours(-24 * (day - 1));
    }
    return fecha;
}
$.formateaFechaNumerico = function (d) {
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "" + month + "" + day;
    return date;
}

$.formateaFecha = function (d) {
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "/" + month + "/" + day;
    return date;
}

function salir() {
    window.location = "index.html";
}

function goPage(page) {
    window.location = page + ".html?personId=" + personId + "&fullName=" +  fullName + "&horas=" +
        horas + "&notificaciones=" + notificaciones + "&permisos=" + permisos;
}

function goPageRepo() {
    return "reportePersonal.html?personId=" + personId + "&fullName=" +  fullName + "&horas=" +
        horas + "&notificaciones=" + notificaciones + "&permisos=" + permisos;
}

function reportePersonal(){
    goPage('reportePersonal');
}

function reporteEmpleados(){
    goPage('reporteEmpleados');
}

function reporteHorasViaje(){
    goPage('reporteHorasViaje');
}

function reporteEventos(){
    goPage('reporteEventos');
}

function nvl(value1, value2) {
        if (value1 == null || value1 == "")
            return value2;
        return value1;
    }
    //mensaje tipo 1 error, 2 aviso. mensajes cortos
function muestraMensaje(tipo, mensaje, nombreDialog) {
    var imagen;
    if (tipo == 1) {
        imagen = "http://www.3smannequins.com/images/close.png";
    } else {
        imagen = "http://pablolemus.mx/sites/all/themes/plemus/images/plat-fbcheck.png";
    }
    $(".tblDtlMsg").remove();
    var strHtml = "<table class='tblDtlMsg'><thead><th><img src='" + imagen + "' " +
        "width=50 height=50/></th><th><h4 class='mBlue'>" + mensaje +
        "</h4></th></thead></table>";
    $(nombreDialog).append(strHtml);
    $(nombreDialog).dialog({
        modal: true
    });
}

function muestraMensajeEvento(tipo, mensaje, nombreDialog, location) {
    var imagen;
    if (tipo == 1) {
        imagen = "http://www.3smannequins.com/images/close.png";
    } else {
        imagen = "http://pablolemus.mx/sites/all/themes/plemus/images/plat-fbcheck.png";
    }
    $(".tblDtlMsg").remove();
    var strHtml = "<table class='tblDtlMsg'><thead><th><img src='" + imagen + "' " +
        "width=50 height=50/></th><th><h4 class='mBlue'>" + mensaje +
        "</h4></th></thead></table>";
    $(nombreDialog).append(strHtml);
    if (tipo == 1) {
        $(nombreDialog).dialog({
            modal: true
        });
    } else {
        $(nombreDialog).dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    goPage(location);
                }
            }
        });
    }
}

function cargaMenuHF() {
    var btnHome = "<!-- submenu btn --><div id='sb-side-left'><button id='sb-home' type='button' class='btn btn-default " +
        "app-submenu-btn mBlue animated' aria-label='Left Align' onclick='reportePersonal()'><span class='glyphicon " +
        "glyphicon-home' aria-hidden='true'></span></button><!-- HOME --></div>";
    var btnEventos = "<button id='sb-reporte-eventos' type='button' class='btn btn-default app-submenu-btn " +
        "sub-menu-normal animated' aria-label='Left Align' onclick='reporteEventos()'><span " +
        "class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button><!-- REPORTE EVENTOS -->";
    var btnHorasViaje = "<button id='sb-horas-recuperacion-viaje' type='button' class='btn btn-default app-submenu-btn " +
        "sub-menu-normal animated' aria-label='Left Align' onclick='reporteHorasViaje()'><span class='glyphicon " +
        "glyphicon-time' aria-hidden='true'></span></button><!-- HORAS RECUPERACION VIAJES -->";
    var btnEmpleados = "<button id='sb-reporte-empleados' type='button' class='btn btn-default app-submenu-btn sub-menu-normal " +
        "animated' aria-label='Left Align' onclick='reporteEmpleados()'><span class='glyphicon glyphicon-list' " +
        "aria-hidden='true'></span></button><!-- REPORTE EMPLEADOS -->";
    var btnCerrar = "<!-- submenu side left --><div id='sb-side-right'><button id='sb-cerrar' type='button' class='btn btn-default " +
        "app-submenu-btn sub-menu-close animated' aria-label='Left Align'><span class='glyphicon glyphicon-remove' " +
        "aria-hidden='true'></span></button><!-- CERRAR -->";
    var end = "</div><!-- submenu side right -->";
    $.each(JSON.parse(permisos), function (i, item) {
        if (item.appId == 19) {
            $.each(item.permisos, function (j, item2) {
                if (item2 == 5) {
                    $("#homeHorarios").append(btnHome);
                } else if (item2 == 2) {
                    $("#sb-side-right").append(btnEventos);
                } else if (item2 == 3) {
                    $("#sb-side-right").append(btnHorasViaje);
                } else if (item2 == 4) {
                    $("#sb-side-right").append(btnEmpleados);
                }
            });
        }
    });
}

var personId = decodeURIComponent($.urlParam('personId'));
var fullName = decodeURIComponent($.urlParam('fullName'));
var permisos = decodeURIComponent($.urlParam('permisos'));
var horas = decodeURIComponent($.urlParam('horas'));
var notificaciones = decodeURIComponent($.urlParam('notificaciones'));