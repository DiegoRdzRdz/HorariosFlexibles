function submenu_click () {
    $('#sub-menu-btn').removeClass('zoomIn');
    $('#sub-menu-btn').addClass('zoomOut');

    $('#sb-cerrar').delay(125).animate({marginLeft: 0} , 400);
    $('#sb-reporte-eventos').delay(100).animate({marginLeft: 0} , 400);
    $('#sb-horas-recuperacion-viaje').delay(50).animate({marginLeft: 0} , 400);
    $('#sb-reporte-empleados').animate({marginLeft: 0} , 400);

    $('#sb-home').delay(200).animate({marginLeft: 0} , 400);

}

function submenu_close () {
    $('#sub-menu-btn').removeClass('zoomOut');
    $('#sub-menu-btn').addClass('zoomIn');

    $('#sb-cerrar').delay(50).animate({marginLeft: 120} , 400);
    $('#sb-reporte-eventos').delay(75).animate({marginLeft: 120} , 400);
    $('#sb-horas-recuperacion-viaje').delay(100).animate({marginLeft: 120} , 400);
    $('#sb-reporte-empleados').delay(125).animate({marginLeft: 120} , 400);
    $('#sb-home').delay(1).animate({marginLeft: 120} , 400);
}

$('#sub-menu-btn').on('click', function() {
    submenu_click();
});

$('#sb-cerrar').on('click', function() {
    submenu_close();
});