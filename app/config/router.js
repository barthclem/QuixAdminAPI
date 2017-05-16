/**
 * Created by barthclem on 4/25/17.
 */
'use strict';

module.exports.setUp = (app, serviceLocator) => {

    // let categoryRoute = require('../routes/category')(serviceLocator);
    // let categoryEntryRoute = require('../routes/categoryEntry')(serviceLocator);
    // let eventRoute =  require('../routes/event')(serviceLocator);
    // let eventAdminRoute = require('../routes/eventAdmin')(serviceLocator);
    let organizerRoute = require('../routes/organizer')(serviceLocator);
    let participantRoute = require('../routes/participant')(serviceLocator);
    let roleUserRoute = require('../routes/roleUser')(serviceLocator);
    let userRoute = require('../routes/user')(serviceLocator);

    app.use('/api/user', userRoute);
    // app.use('/api/category', categoryRoute);
    // app.use('/api/categoryEntry', categoryEntryRoute);
    // app.use('/api/event', eventRoute);
    // app.use('/api/eventAdmin', eventAdminRoute);
    app.use('/api/organizer', organizerRoute);
    app.use('/api/participant', participantRoute);
    app.use('/api/roleUser', roleUserRoute);


};