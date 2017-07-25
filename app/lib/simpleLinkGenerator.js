/**
 * Created by barthclem on 5/17/17.
 */
module.exports = function (title) {
    return new Promise((resolve)=> {
        let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        for (let i = 20; i > 0; --i) {
            token += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        token = title ? (title.replace(/\s/ig, '') + (new Date()).getTime()) + token : token;
        return resolve(token);
    });
};
