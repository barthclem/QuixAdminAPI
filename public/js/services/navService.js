/**
 * Created by aanu.oyeyemi on 13/03/2017.
 */
'use strict';


angular.module('messageApp').service('NavService', NavService);

function NavService () {
    var isLoggedIn = false;

    this.setLogInStatus =  function (status) {
        isLoggedIn = status;
    }

    this.getLogInStatus = function () {
        return isLoggedIn;
    }
}