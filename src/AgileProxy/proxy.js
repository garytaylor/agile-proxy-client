var isNode;
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    isNode = true;
}
define(function (require, exports, module) {
    var _, RequestSpec;
    _ = require('underscore');
    RequestSpec = require('./RequestSpec');

    function Proxy() {
        this._config = {
            apiVersion: 'v1',
            userId: '1',
            applicationId: '1',
            restUrl: 'http://localhost:3020/api'
        };

    }
    _.extend(Proxy.prototype, {
        /**
         * @method stub
         * Defines a stub for a url and returns a {@link AgileProxyClient::RequestSpec}
         * @param {String} url The url to match against
         * @param {Object} options Options as follows :-
         * @param {String} options.method The HTTP method ('GET', 'POST' etc..)
         * @returns {RequestSpec} The unpersisted request spec created. You can either call {@link AgileProxyClient::RequestSpec#done}
         * on the request spec, or for a simpler way of defining multiple stubs with a single callback, see {@link #define}
         */
        stub: function (url, options) {
            return new RequestSpec(_.extend({url: url}, options));
        },
        config: function (configObj) {
            _.extend(this._config, configObj);
        },
        /**
         * @method define
         * This method allows a simpler syntax for defining multiple stubs.
         * For example :-
         *     proxy.define([
         *       proxy.stub('http://www.google.com').andReturn({html: 'This is not really google'});
         *       proxy.stub('http://localhost:3000/forums', {method: 'POST'}).andReturn({json: {name: "Some forum name"}});
         *     ], callback, scope);
         *
         * @param {AgileProxyClient::RequestSpec[]|Function} defsOrFn An array of request specs or a function which is passed
         * a proxy object which will collect the defs.
         * @param {Function} callback A function which is called when all request specs are generated or an error occured
         * @param {Object} scope The scope of the callback
         */
        define: function (defsOrFn, callback, scope) {
            var callbacksCalled, restUrl, config, collectedSpecs;
            function privateCallback (error, response) {
                if (error) {
                    callback.apply(scope || this, [error]);
                    return;
                }
                callbacksCalled = callbacksCalled - 1;
                if (callbacksCalled === 0) {
                    callback.apply(scope || this, [null]);
                }
            }
            function generateProxy(me) {
                return {
                    stub: function () {
                        var returnedSpec;
                        returnedSpec = me.stub.apply(me, arguments);
                        collectedSpecs.push(returnedSpec);
                        return returnedSpec;
                    }
                };
            }
            config = this.getConfig();
            restUrl = config.restUrl + '/' + config.apiVersion + '/users/' + config.userId + '/applications/' + config.applicationId + '/request_specs';
            if (_.isFunction(defsOrFn)) {
                collectedSpecs = [];
                defsOrFn.apply(this, [generateProxy(this)]);
                defsOrFn = collectedSpecs;
            }
            if (defsOrFn instanceof Array) {
                callbacksCalled = defsOrFn.length;
                _.each(defsOrFn, function (def) {
                    def.done(restUrl, privateCallback, this);
                });
            }

        },
        removeAllStubs: function (callback) {
            var config;
            config = this.getConfig();
            RequestSpec.removeAll(config.restUrl + '/' + config.apiVersion + '/users/' + config.userId + '/applications/' + config.applicationId + '/request_specs', callback);
        },
        getConfig: function () {
            return this._config;
        }

    });
    module.exports = Proxy;
});
