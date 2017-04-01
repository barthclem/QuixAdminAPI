'use strict';

let mailer = require('nodemailer');

module.exports = function (config, logger) {

    return function mailSender(mailOptions) {
    let mail = mailOptions;

    let transporter = mailer.createTransport({
        service: config.email.gmail.service,
        auth: {
            user: config.email.gmail.username,
            pass: config.email.gmail.authenticator
        }

    });
    return new Promise((resolve, reject) => {
        transporter.sendMail(mail, function (error, info) {
            if (error) {
                logger.log(`mailSender : Error => ${error}`);
                return reject(error);
            } else {
                resolve(' Email is/are Sent ');
                logger.log('Email is sent');
            }
        });
    });
};

};

