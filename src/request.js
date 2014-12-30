'use strict';
var _ = require('underscore');
var exports = {};
var parse = function (req) {
    var result;
    try {
        result = JSON.parse(req.responseText);
    } catch (e) {
        result = req.responseText;
    }
    return [result, req];
};

var xhr = function (type, url, data, cb) {
    var headers;
    var methods = {
        success: function () {},
        error: function () {}
    };
    headers = {};
    if (_.isObject(data)) {
        if (data.hasOwnProperty('json')){
            data = JSON.stringify(data.json);
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        } else {
            data = JSON.stringify(data);
        }
    }
    var XHR = window.XMLHttpRequest || ActiveXObject;
    var request = new XHR('MSXML2.XMLHTTP.3.0');
    request.open(type, url, true);
    _.each(headers, function (value, key) {
        request.setRequestHeader(key, value);
    });
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                cb.apply(this, [null, {}, parse(request)]);
            } else {
                cb.apply(this, [true, {}, parse(request)]);
            }
        }
    };
    request.send(data);
    return {
        success: function (callback) {
            methods.success = callback;
            return methods;
        },
        error: function (callback) {
            methods.error = callback;
            return methods;
        }
    };
};

exports['get'] = function (src, cb) {
    return xhr('GET', src, null, cb);
};

exports['put'] = function (url, data, cb) {
    return xhr('PUT', url, data, cb);
};

exports['post'] = function (url, data, cb) {
    return xhr('POST', url, data, cb);
};

exports['delete'] = function (url, cb) {
    return xhr('DELETE', url, null, cb);
};

return exports;

