/**
 * Created by aanu.oyeyemi on 18/03/2017.
 */
angular.module('messageApp').directive('uploadImage', ['$parse', UploadFunction]);

function UploadFunction($parse) {
    return {
        restrict : 'A',

        link: function (scope, elm, attr) {
            let model = $parse(attr.fileModel);
            let modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(()=>{
                    modelSetter(scope, elm[0].files[0]);
                });
            });
        }
    };
}