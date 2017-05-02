/**
 * Created by aanu.oyeyemi on 29/04/2017.
 */
'use strict';
let roleConstants = require('../config/constants').ROLES;
function loadRole (dataGroupId, itemId) {
    return function (req, res, next) {
        let sessionData = req.session;
        let rolesData = sessionData.roleData;
        //check if a user is a superAdmin
        if(itemId){
            getRoleWithItemId(sessionData, rolesData,dataGroupId, itemId)
                .then(role => {
                    sessionData.role = role;
                    next();
                });
        }
        else{
            getRole(sessionData, rolesData, dataGroupId)
                .then(role => {
                    sessionData.role = role;
                    next();
                });
        }
    };
}
function getRoleWithItemId (sessionData, data, dataGroupId, itemId, next){
    return new Promise((resolve) => {
        let role = roleConstants.GUEST;
        for(let i = 0; i< data.length; i++){
            if(data[i].role_title === roleConstants.SUPERADMIN){
                //if the user is a superAdmin
                role = data[i].role_title;
                break;
            }
            else if(data[i].data_group_id === dataGroupId && data[i].itemId === itemId){
                role = data[i].role_title;
                break;
            }
        }
        return resolve(role);
    });


}

function getRole (sessionData, data, dataGroupId) {
    return new Promise((resolve) => {
        let role = roleConstants.GUEST;
        for(let i = 0; i< data.length; i++){
            if(data[i].role_title === roleConstants.SUPERADMIN){
                //if the user is a superAdmin
                role = data[i].role_title;
                break;
            }
            else if(data[i].data_group_id === dataGroupId) {
                role = data[i].role_title;
                break;
            }
        }
        return resolve(role);
    });

}
module.exports =  loadRole;
