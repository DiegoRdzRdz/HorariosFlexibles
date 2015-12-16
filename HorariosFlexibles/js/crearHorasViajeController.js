var creaHVApp = angular.module("horariosFlexiblesApp", ["kendo.directives"]);
creaHVApp.controller("crearHorasViajesCtrl", ['$scope','$http',function ($scope,$http) {
    cargaMenuHF();
    $scope.showModalCorrect = false; $scope.showModalIncorrect = false; $scope.showModalAlert = false; 
    $scope.old = null;
    $scope.comentarios; $scope.fecha; $scope.chkBoxMore6; 
    $scope.personId = decodeURIComponent($.urlParam('personId'));
    $scope.fullName = decodeURIComponent($.urlParam('fullName'));
    $scope.urlToReportInd= goPageRepo();
    $scope.toggleModalCorrect = function(){ $scope.showModalCorrect = !$scope.showModalCorrect; };
    $scope.toggleModalIncorrect = function(){ $scope.showModalIncorrect = !$scope.showModalIncorrect; };
    $scope.toggleModalAlert = function(){ $scope.showModalAlert = !$scope.showModalAlert; };
    $("#switch-size").bootstrapSwitch(); 
    
    $scope.nationalDays = function(date) {
        var m = date.getMonth() + 1; var d = date.getDate(); var y= date.getFullYear();
        var dateString = y+"/"+m+"/"+d;
        return ($.inArray(dateString,$scope.enabledDays) > -1) ? true : false;
    };
    
    $scope.onlyWeekendsOrHolidays = function(date) {
        var weekend = (date.getDay() == 0 || date.getDay() == 6) ? true : false;
        return  weekend ? weekend : $scope.nationalDays(date);
    };
    
    $scope.daySelectorOptions = {
        dates: $scope.enabledDays,
        format: "dd/MMM/yyyy", 
        month: { content: $("#template").html() } ,
        change: function() {
              var value = this.value();
              if ($scope.onlyWeekendsOrHolidays(value) == false) {
                 this.value($scope.old); 
              } else {
                 $scope.old = new Date(value);
              }
       }
    };
    
    $scope.createEvent = function(){
        var curDate = new Date();
        var dateStringReg = curDate.getFullYear()+"/"+curDate.getMonth()+"/"+curDate.getDate();
        
        $scope.data={
            comentario: $scope.comentarios,
            fecha: $scope.fecha,
            fechaRegistro: dateStringReg,
            masSeisHoras: $scope.chkBoxMore6 ? 1 : 0,
            personId:$scope.personId,
            estatusId: 1
        };
        
        $http.post("http://cloud.metalsa.com/BusServiceMetalsa-war/service/crearHorasViaje", $scope.data)
            .success(function(data, status) {
            
                if (data.statusEvento == true) {
                    if(data.statusMail == true) $scope.toggleModalCorrect(); else  $scope.toggleModalAlert();
                } else {
                    $scope.toggleModalIncorrect();
                }
                $scope.comentarios = null;
                $scope.fecha = null;
                $scope.chkBoxMore6 = null;
            })
    };
    
    $http.get('http://cloud.metalsa.com/BusServiceMetalsa-war/service/person/'+$scope.personId+'/getDiasFestivosLocalidadHF')
    .success(function(data) {
        $scope.enabledDays = data.diasFestivos;
    });
    
}]);


creaHVApp.directive('modal', function () {
    return {
        template: '<div class="modal fade">'+
                        '<div class="modal-dialog">'+
                            '<div class="modal-content">' +
                                '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                    '<h4 class="modal-title">{{ title }}</h4>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<div class="row">'+
                                        '<div class="col-xs-3"> <img width=50 height=50 src="{{image}}" /> </div>'+
                                        '<div class="col-xs-9"> <p>{{ message }}</p> </div>'+
                                    '</div>'+
                                    '<a class="btn btn-default" href="{{url}}"> ok </button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
          restrict: 'E',
          transclude: false,
          replace:true,
          scope:true,
          link: function postLink(scope, element, attrs) {
              scope.title = attrs.title;
              scope.message = attrs.message;
              scope.image = attrs.image;
              
              scope.$watch(attrs.url, function(value){
                    scope.url = value;
              });
              scope.$watch(attrs.visible, function(value){
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
              });

              $(element).on('shown.bs.modal', function(){
                  scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;
                  });
              });

              $(element).on('hidden.bs.modal', function(){
                  scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                  });
              });

          }
    };
  });