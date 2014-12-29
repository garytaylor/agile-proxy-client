define(['require', 'sinon', 'underscore'], function (require, sinon, _) {
    var callTracker, host;
    callTracker = {};
    return {
        setupFakeServer: function (options) {
            options = options || {};
            options.port = options.port || 4000;
            host = 'http://localhost:' + options.port;
            this.server = sinon.fakeServer.create();
            callTracker = {};
        },
        teardownFakeServer: function () {
            this.server.restore();
        },
        stubRequest: function (method, urlOrRegex) {
            var url, me, response;
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
            this.server.respondWith(method, url, function (request) {
                response = me.getStubbedRequest(method, urlOrRegex).fn(method, {url: request.url, body: request.requestBody, headers: request.requestHeaders}) || {body: ''};
                request.respond(response.status || 200, response.headers || {}, response.body);
                return true;
            });

        },
        getStubbedRequest: function(method, urlOrRegex) {
            if (!callTracker.hasOwnProperty(method) || !callTracker[method][urlOrRegex]) {
                throw new Error('No request has been stubbed for "' + method + '" : "' + urlOrRegex + '"');
            }
            return callTracker[method][urlOrRegex];
        },
        sendServerResponse: function () {
            this.server.respond();
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
        }

    };
});