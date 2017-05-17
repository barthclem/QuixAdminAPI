/**
 * Created by barthclem on 5/17/17.
 */
module.exports = function (title) {
    return (title.replace(/\s/ig, '') + (new Date()).getTime());
};