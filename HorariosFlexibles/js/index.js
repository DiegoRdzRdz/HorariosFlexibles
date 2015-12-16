var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        navigator.splashscreen.hide();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

};
$(function () {
    $.blockUI.defaults.message = 'Procesando...';
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
});

function login(form) {
    var email = form.email.value;
    var pwd = form.pwd.value;
    var fecha = $.getLunes();
    var lunes = $.formateaFechaNumerico(fecha);
    fecha.setDate(fecha.getDate() + 6)
    var domingo = $.formateaFechaNumerico(fecha);
    if (email == '' || pwd == '') {
        muestraMensaje(1, "Email y password son requeridos", "#dlgMessage");
        return;
    }
    // window.location = "home.html?personId=" + "13572" + "&fullName=" + 
    //    "Taméz García Jesús Alejandro" + "&horas=" + "00:00";

    $.ajax({
        url: "http://cloud.metalsa.com/BusServiceMetalsa-war/service/autenticar",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            usuario: email,
            password: pwd,
            fechaInicio: lunes,
            fechaFin: domingo
        }),
        dataType: "json"
    }).done(function (data) {
        if (data.userValid == 'true') {
            window.location = "home.html?personId=" + data.employeeID + "&fullName=" + data.fullName + "&horas=" +
                data.horas + "&notificaciones=" + data.notificaciones + "&permisos=" + JSON.stringify(data.permisos);
        } else {
            muestraMensaje(1, "Credenciales invalidas", "#dlgMessage");
        }
    }).fail(function (jqXHR, textStatus) {
        muestraMensaje(1, "Error en el servidor", "#dlgMessage");
    });
}