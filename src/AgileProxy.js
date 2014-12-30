var isNode;
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    isNode = true;
}
define(function (require, exports, module) {
    module.exports = {
        Proxy: require('./AgileProxy/proxy')
    };
    if (typeof window !== 'undefined') {
        window.AgileProxy = module.exports;
    }

});