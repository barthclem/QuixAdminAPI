/**
 * Created by aanu.oyeyemi on 18/03/2017.
 */
angular.module('messageApp').service('UploadService', ['$http', UploadService]);

function UploadService($http) {
    this.upload = function (file) {
        let fileData = new FormData();

        fileData.append('file', file);

        return new Promise((resolve, reject)=>{
            $http.post('/upload', fileData, {
                transformRequest: angular.identity,
                headers : {'Content-Type': undefined}
            });
        })

    }
}