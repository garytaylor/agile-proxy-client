var callTracker, host, _;
callTracker = {};
_ = require('underscore');
module.exports = {
    setupFakeServer: function (options) {
        var nock;
        options = options || {};
        options.port = options.port || 4000;
        host = 'http://localhost:' + options.port;
        if (typeof sinon !== 'undefined') {
            this.server = sinon.fakeServer.create();
            this.server.autoRespond = true;
            this.server.autoRespondAfter = 10;
        } else {
            nock = require('nock');
            nock.cleanAll();
        }
        callTracker = {};
    },
    teardownFakeServer: function () {
        if (typeof sinon !== 'undefined') {
            this.server.restore();
        }
    },
    stubRequest: function (method, urlOrRegex) {
        var url, me, response, nock;
        me = this;
        if (_.isRegExp(urlOrRegex)) {
            url = urlOrRegex;
        } else if (_.isString(urlOrRegex)) {
            if (urlOrRegex.match(/^http/)) {
                url = urlOrRegex;
            } else {
                url = host + urlOrRegex;
            }
        } else {
            url = urlOrRegex;
        }
        this.setupCallFor(method, urlOrRegex);
        if (typeof sinon !== 'undefined') {
            this.server.respondWith(method, url, function (request) {
                if (!request.requestHeaders['Content-Type'].match(/application\/json/)) {
                    request.respond(404, {}, 'Not Found');
                    return true;
                }
                response = me.getStubbedRequest(method, urlOrRegex).fn(method, {url: request.url, body: request.requestBody}) || {body: ''};
                request.respond(response.status || 200, response.headers || {}, response.body);
                return true;
            });
        } else {
            nock = require('nock');
            nock(host, {reqheaders: {'Content-Type': 'application/json'}}).persist()[method.toLowerCase()](urlOrRegex).reply(200, function (uri, requestBody) {
                response = me.getStubbedRequest(method, urlOrRegex).fn(method, {url: host +uri, body: requestBody}) || {body: ''};
                return response.body;

            });
        }
        return this.getStubbedRequest(method, urlOrRegex);

    },
    getStubbedRequest: function(method, urlOrRegex) {
        if (!callTracker.hasOwnProperty(method) || !callTracker[method][urlOrRegex]) {
            throw new Error('No request has been stubbed for "' + method + '" : "' + urlOrRegex + '"');
        }
        return callTracker[method][urlOrRegex];
    },
    sendServerResponse: function () {
        if (typeof sinon !== 'undefined') {
            this.server.respond();
        }
    },
    setupCallFor: function (method, urlOrRegex) {
        callTracker[method] = callTracker[method] || {};
        callTracker[method][urlOrRegex] = callTracker[method][urlOrRegex] || {fn: function () {}};
    },
    getCreatedStub: function () {
        return {
            id: '10',
            url: ''
        };
    },
    getCreatedStubRecordings: function () {
        return {
            recordings: [
                {request_url: 'http://www.google.com', request_method: 'GET'},
                {request_url: 'http://www.google.com', request_method: 'GET'}
            ]
        }
    }

};
