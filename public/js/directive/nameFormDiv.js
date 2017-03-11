/**
 * Created by aanu.oyeyemi on 04/03/2017.
 */
'use strict';
 angular.module('messageApp').directive('validName', function () {
     return {
         require : 'ngModel',
         link : function (scope, elm, attr, ctrl){
             function validator( viewValue) {
                 ctrl.$setValidity('validName', String.prototype.match.call(''+viewValue,/^[A-z]{3,}$/) !== null);
                 return viewValue;
             }
             ctrl.$parsers.unshift(validator)
         }
     }
 });
