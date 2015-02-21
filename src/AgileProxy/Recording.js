var _, request, S;
_ = require('underscore');
request = require('request');
S = require('string');
function Recording(attrs) {
    _.extend(this, attrs);
    this._data = {};
}
_.extend(Recording, {
    all: function (config, cb) {
        request.get({url: config.restUrl, headers: {'Content-Type': 'application/json'}}, function (err, response, body) {
            var obj;
            if (err) {
                return cb(err);
            }
            if (_.isString(body)) {
                obj = JSON.parse(body);
            } else {
                obj = body;
            }
            cb(null, _.map(obj.recordings, function (data) {return new Recording(data); }));
        });
    }
});
_.extend(Recording.prototype, {
//    t.integer  "application_id"
//t.text     "request_headers"
//t.text     "request_body"
//t.string   "request_url"
//t.string   "request_method"
//t.text     "response_headers"
//t.text     "response_body"
//t.text     "response_status"
//t.integer  "request_spec_id"
//t.datetime "created_at"
//t.datetime "updated_at"
    getRequestHeaders: function () {
        return this.get('requestHeaders');
    },
    getRequestBody: function () {
        return this.get('requestBody');
    },
    getRequestUrl: function () {
        return this.get('requestUrl');
    },
    getRequestMethod: function () {
        return this.get('requestMethod');
    },
    getResponseHeaders: function () {
        return this.get('responseHeaders');
    },
    getResponseBody: function () {
        return this.get('responseBody');
    },
    getRequestSpecId: function () {
        return this.get('requestSpecId');
    },
    get: function (camelCasedKey) {
        return this[S(camelCasedKey).underscore()];

    }

});
module.exports = Recording;