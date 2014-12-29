define(function (require) {

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

    var xhr = function (type, url, data, headers) {
        var methods = {
            success: function () {},
            error: function () {}
        };
        headers = headers || {};
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
                    methods.success.apply(methods, parse(request));
                } else {
                    methods.error.apply(methods, parse(request));
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

    exports['get'] = function (src) {
        return xhr('GET', src);
    };

    exports['put'] = function (url, data) {
        return xhr('PUT', url, data);
    };

    exports['post'] = function (url, data) {
        return xhr('POST', url, data);
    };

    exports['delete'] = function (url) {
        return xhr('DELETE', url);
    };

    return exports;

});
