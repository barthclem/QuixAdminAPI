/**
 * Created by aanu.oyeyemi on 29/04/2017.
 */
'use strict';
let roleConstants = require('../config/constants').ROLES;
let dataGroupConstants = require('../config/constants').DATA_GROUP;
let authTree = require('./../services/rbacRedisService');

/**
 * @description this middleware loads the role a user has for a roleGroup such as event, user and others
 * @param dataGroupId this defines a roleGroup such as event using its defined id
 * @param itemId this defines an instance of a member of a roleGroup e.g an event with id 8
 * @param params this defines the name of the request parameter to use instead of using `id`
 * @return {Function}
 */
function loadRole(dataGroupId, itemId, params) {
    return function (req, res, next) {
        let sessionData = req.session;
        let rolesData = sessionData.roleData;
        //check if a user is a superAdmin
        if (itemId) {
            let item_id = Number(req.params.id || req.params[params]);
            getRoleWithItemId(rolesData, dataGroupId, item_id)
                .then(role => {
                    sessionData.role = role;
                    next();
                });
        }
        else {
            getRole(rolesData, dataGroupId)
                .then(role => {
                    sessionData.role = role;
                    next();
                });
        }
    };
}
/**
 * @description  this function get roles of a each item of rolesGroups
 * @param data  data containing all roles available
 * @param dataGroupId a subset of all the roles available e.g category, participant, event,  etc
 * @param itemId this ensure that dataGroupId roles is for only an instance e.g an eventAdmin can edit his/her event
 * @return {Promise}
 */
async function getRoleWithItemId(data, dataGroupId, itemId) {
    let role = roleConstants.GUEST;

    for (let i = 0; i < data.length; i++) {
        if (data[i].role_title === roleConstants.SUPERADMIN) {
            //if the user is a superAdmin
            role = data[i].role_title;
            break;
        } else //check if a user has a role for an instance of dataGroupId e.g if a user can edit an event with id 7
        if (data[i].data_group_id === dataGroupId && Number(data[i].itemId) === itemId) {
            role = data[i].role_title;
            break;
        } else if (dataGroupId === dataGroupConstants.CATEGORY.id &&
            data[i].data_group_id === dataGroupConstants.EVENT.id) {
            let result = await
            authTree.categoryBelongsToEvent(data[i].itemId, itemId);
            if (result) {
                role = data[i].role_title;
                break;
            }
        } else if (dataGroupId === dataGroupConstants.CATEGORY_ENTRY.id &&
            data[i].data_group_id === dataGroupConstants.EVENT.id) {
            let result = await authTree.catEntBelongsToEvent(data[i].itemId, itemId);
            if (result) {
                role = data[i].role_title;
                break;
            }
        }
    }

    return role;
}
/**
 * @description  this function get roles of a each item of rolesGroups
 * @param data data containing all roles available
 * @param dataGroupId a subset of all the roles available e.g category, participant, event,  etc
 * @return {Promise}
 */
function getRole(data, dataGroupId) {
    return new Promise((resolve) => {
        let role = roleConstants.GUEST;
        for (let i = 0; i < data.length; i++) {
            if (data[i].role_title === roleConstants.SUPERADMIN) {
                //if the user is a superAdmin
                role = data[i].role_title;
                break;
            } else if (data[i].data_group_id === dataGroupId) {
                role = data[i].role_title;
                break;
            } else if ((dataGroupId === dataGroupConstants.CATEGORY.id ||
                dataGroupId === dataGroupConstants.CATEGORY_ENTRY.id) &&
                data[i].data_group_id === dataGroupConstants.EVENT.id) {
                role = data[i].role_title;
                break;
            }
        }

        return resolve(role);
    });

}

module.exports =  loadRole;
