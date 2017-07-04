/**
 * Created by aanu.oyeyemi on 06/03/2017.
 */
angular.module('messageApp').directive('datum', ['$http', function ($http) {
    return {
        require: 'ngModel',
        restrict: 'AE',
        scope: {
            dtype: '@'
        },
        link: function (scope,  elm, attr, ctrl) {
            let list;
            $http.get('/users/').then(data => list = data);
            function checkDataExist(inputData) {
                if (list !== undefined) {
                    let propertyName = scope.dtype;
                    let dataList = list.data;
                    for (let i = 0; i < dataList.length; i++) {
                        if ((dataList[i])[propertyName] === inputData) {
                            return true;
                        }
                    }
                }

                return false;
            }

            function checkData(viewValue) {
                ctrl.$setValidity('datum', !checkDataExist(viewValue));
                return viewValue;
            }

            ctrl.$parsers.unshift(checkData);
            ctrl.$formatters.push(checkData);
        }

    };
}]);

