'use strict';

module.exports = function (httpStatus, data) {
    let success = /^[23][0-9]{2}$/.exec(httpStatus);
    return {
        status: success ? 'success' : 'failed',
        data: data ? data : []
    };
};
