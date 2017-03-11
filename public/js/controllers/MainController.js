/**
 * Created by aanu.oyeyemi on 11/03/2017.
 */
'use strict';
angular.module('messageApp').controller('MainController', ['$timeout', '$scope', MainController]);


function MainController ($timeout, $scope) {
    var vm = this;
    vm.message = " Hey Guy ";
    vm.visible = false;
    $scope.$on('messageAlert', (event, data) => {
        vm.message = data.message;
        vm.messageclass = "alert-"+ data.type;
        vm.visible = true;
        $timeout(()=>{
            vm.message = "";
            vm.messageclass = "";
            vm.visible = false;
        }, 5000);
    });

}