'use strict';

module.exports =  function (req, res, next) {
   let sessionData = req.session;
   if(!sessionData.roleData){
    return  res.status(401).send({status : 'failed', message : 'UnAuthenticated Access'});
   }
   next();
  };
