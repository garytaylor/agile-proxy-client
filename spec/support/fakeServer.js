var isNode;
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    isNode = true;
}
define(function (require, exports, module) {
    if (isNode) {
        module.exports = false;
    } else {
        module.exports = require('sinon');
    }


});