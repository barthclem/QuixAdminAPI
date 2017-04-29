/**
 * Created by aanu.oyeyemi on 29/04/2017.
 */
'use strict';
let serviceLocator =
function getAll (dataGroupId, ItemId) {
    return function (req, res, next) {

    }
}

module.exports =  function (req, res, next) {
    let sessionData = req.session;
    if(!sessionData){
        return  res.status(401).send({status : 'failed', message : 'UnAuthenticated Access'})
    }
    next();
};
