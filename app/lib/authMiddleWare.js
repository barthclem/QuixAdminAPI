'use strict';

module.exports =  function (req, res, next) {
   let sessionData = req.session;
   console.log(`Moment Session Data => ${sessionData} `);
   if(!sessionData){
    return  res.status(401).send({status : 'failed', message : 'UnAuthorized Access'})
   }
   next();
  };
