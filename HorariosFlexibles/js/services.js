angular.module('portalMetalsa.services')

.factory('GlobalVariables', function () {
    var variables = {
        personId: '',
        fullName: '',
        horas: '',
        notificaciones: '',
        permisos: ''
    }
    return variables;
})