var _, Response, request, Recording;
_ = require('underscore');
Response = require('./Response');
Recording = require('./Recording');
request = require('request');
function RequestSpec(attrs) {
    _.extend(this, {method: 'GET'}, attrs);
    this._data = {};
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
    setRestUrl: function (value) {
        this._restUrl = value;
    },
    getRestUrl: function () {
        return this._restUrl;
    },
    done: function (callback) {
        var obj, me, url;
        me = this;
        url = this.getRestUrl();
        request.post({url: url, json: this.asJson()}, function (err, response, body) {
            var obj;
            if (!err) {
                //When the content type is application/json, the request module automatically decodes the json
                if (_.isString(body)) {
                    obj = JSON.parse(body);
                } else {
                    obj = body;
                }
                me._data = obj;
                callback.apply(this, [null, obj.mock_request]);
            } else {
                callback.apply(this, [err, '']);
            }
        });
    },
    getId: function () {
        return this._data.id;
    },
    getRecordings: function (cb) {
        if (!this.getId()) {
            throw new Error('This request spec has not been saved yet');
        }
        Recording.all({restUrl: this.getRestUrl() + '/' + this.getId() + '/recordings'}, cb);
    }

});
module.exports = RequestSpec;