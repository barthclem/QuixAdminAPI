/**
 * Created by aanu.oyeyemi on 13/03/2017.
 */
'use strict';

angular.module('messageApp').service('CookieService', [ '$cookies' , CookieService])

function CookieService ( $cookies) {
    var temp_date = new Date();
    temp_date.setDate(temp_date.getDate()+1);
    var defaultDuration = temp_date;

    this.setValidDuration = function ( dayValidity ) {
        temp_date = new Date();
        temp_date.setDate( temp_date.getDate() + dayValidity);
    }

    this.getValidDuration = function () {
        return temp_date;
    }

    this.setCookie = function ( name, data , validity) {
        let savedData = {};
        $cookies.remove(name);
        for( let datum in data){
            savedData[`${datum}`] = btoa(data[`${datum}`]);//new Buffer(data[`${datum}`]).toString('base64');
        }
        $cookies.putObject(name, savedData, { expires : this.getValidDuration() || validity});
    }

    this.getCookie = function ( name ) {
        let savedData = $cookies.getObject(name);
        let data = {};
         for( let datum in savedData){
             data[`${datum}`] = atob(savedData[`${datum}`]);//new Buffer(savedData[`${datum}`], 'base64').toString('base64');
         }
        return data;
    }

    this.deleteCookie = function ( name ) {
        $cookies.remove(name);
    }
}