/**
 * Created by aanu.oyeyemi on 18/03/2017.
 */
'use strict';
angular.module('messageApp').controller('ProfileController', ['$scope', 'UploadService', ProfileController]);

function ProfileController($scope, uploadService) {
    let vm = this;
    vm.upload = function () {
        let file = $scope.file;
        uploadService.upload(file).then((data)=>{
            console.log(data);
            $scope.image = file;
        }).catch( error => {

        });

    }
}