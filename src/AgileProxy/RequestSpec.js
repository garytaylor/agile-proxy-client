var isNode = false;
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    isNode = true;
}
define(function (require, exports, module) {
    var _, Response, request;
    _ = require('underscore');
    Response = require('./Response');
    request = require('request');
    function RequestSpec(attrs) {
        _.extend(this, {method: 'GET'}, attrs);
    }
    _.extend(RequestSpec, {
        removeAll: function (url, callback) {
            request.del(url, {}, function (err, response, body) {
                if (err) {
                    callback.apply(this, [err]);
                } else {
                    callback.apply(this, [null]);
                }
            });
        }
    });
    _.extend(RequestSpec.prototype, {
        andReturn: function (options) {
            this.response = new Response(options);
            return this;
        },
        asJson: function () {
            return {url: this.url, http_method: this.method, conditions: JSON.stringify(this.conditions), response: this.response.asJson()};
        },
        done: function (url, callback) {
            var obj;
            request.post(url, {json: this.asJson()}, function (err, response, body) {
                var obj;
                if (!err) {
                    //When the content type is application/json, the request module automatically decodes the json
                    if (_.isString(body)) {
                        obj = JSON.parse(body);
                    } else {
                        obj = body;
                    }

                    callback.apply(this, [null, obj.mock_request]);
                } else {
                    callback.apply(this, [err, '']);
                }
            });
        }

    });
    module.exports = RequestSpec;
});