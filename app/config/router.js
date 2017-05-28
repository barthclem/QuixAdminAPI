/**
 * Created by barthclem on 4/25/17.
 */
'use strict';

module.exports.setUp = (app, serviceLocator) => {

    let categoryRoute = require('../routes/category')(app, serviceLocator);
    let categoryEntryRoute = require('../routes/categoryEntry')(app, serviceLocator);
    let eventRoute =  require('../routes/event')(app, serviceLocator);
    let eventAdminRoute = require('../routes/eventAdmin')(app, serviceLocator);
    let organizerRoute = require('../routes/organizer')(app, serviceLocator);
    let participantRoute = require('../routes/participant')(app, serviceLocator);
    let roleUserRoute = require('../routes/roleUser')(app, serviceLocator);
    let userRoute = require('../routes/user')(app, serviceLocator);

    app.use('/api/user', userRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/categoryEntry', categoryEntryRoute);
    app.use('/api/event', eventRoute);
    app.use('/api/eventAdmin', eventAdminRoute);
    app.use('/api/organizer', organizerRoute);
    app.use('/api/participant', participantRoute);
    app.use('/api/roleUser', roleUserRoute);

};