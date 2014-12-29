var isNode = false;
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    isNode = true;
}
define(function (require) {
    var _, proxy, restPort, spec1Request, spec2Request, freeport, helper, collectionUrl;
    describe('AgileProxyClient', function () {
        beforeEach(function () {
            restPort = 4000;
            proxy = new (require('../../src/proxy'))();
            helper = require('./AgileProxyClientSpecHelper');
            collectionUrl = 'http://localhost:' + restPort + '/v1/users/1/applications/1/request_specs';
        });
        describe('With fake server', function () {
            beforeEach(function () {
                helper.setupFakeServer({port: restPort});

            });
            afterEach(function () {
                helper.teardownFakeServer();
            });
            beforeEach(function () {
                proxy.config({
                    proxyUrl: '',
                    restUrl: 'http://localhost:' + restPort
                });
            });
            describe('The define API', function () {
                describe('With positive responses', function () {
                    var stub, correctRequest;
                    beforeEach(function () {
                        helper.stubRequest('POST', '/v1/users/1/applications/1/request_specs');
                        stub = helper.getStubbedRequest('POST', '/v1/users/1/applications/1/request_specs');
                        spyOn(stub, 'fn').and.returnValue({body: JSON.stringify(helper.getCreatedStub())});
                        correctRequest = jasmine.objectContaining({url: collectionUrl});
                    });
                    it('Should send multiple stubs in series using define', function (done) {
                        var call1, call2, callback;
                        callback = jasmine.createSpy();
                        proxy.define(function (p) {
                            p.stub('http://www.google.com', {method: 'GET'}).andReturn({text: 'I am not google'});
                            p.stub('http://mydomain.com/users', {method: 'POST'}).andReturn({json: {name: 'Test User', id: 10}});
                        }, function () {
                            expect(stub.fn.calls.count()).toEqual(2);
                            call1 = stub.fn.calls.argsFor(0);
                            call2 = stub.fn.calls.argsFor(1);
                            expect(call1[0]).toEqual('POST');
                            expect(call1[1]).toEqual(correctRequest);
                            expect(JSON.parse(call1[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/plain', content: 'I am not google'}}));
                            expect(call2[0]).toEqual('POST');
                            expect(call2[1]).toEqual(correctRequest);
                            expect(JSON.parse(call2[1].body)).toEqual(jasmine.objectContaining({url: 'http://mydomain.com/users', http_method: 'POST', response: {content_type: 'application/json', content: '{"name":"Test User","id":10}'}}));
                            done();
                        });
                        helper.sendServerResponse();
                    });
                    describe('Using different content', function () {
                        it('Should set the content type to text/html if the response html property is set', function (done) {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com', {method: 'GET'}).andReturn({html: '<html></html>'});
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/html', content: '<html></html>'}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                        it('Should set the content type and is_template if the response htmlTemplate property is set', function (done) {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com', {method: 'GET'}).andReturn({htmlTemplate: '<html>{{test}}</html>'})
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/html', content: '<html>{{test}}</html>', is_template: true}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                        it('Should set the content type and is_template if the jsonTemplate property is set', function (done) {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com', {method: 'GET'}).andReturn({jsonTemplate: {a: '{{test}}'}});
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'application/json', content: '{"a":"{{test}}"}', is_template: true}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                        it('Should set the content type if the response text property is set', function (done) {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com', {method: 'GET'}).andReturn({text: 'Hello World'});
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/plain', content: 'Hello World'}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                        it('Should set the content type and is_template if the textTemplate property is set', function (done) {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com', {method: 'GET'}).andReturn({textTemplate: 'Hello {{name}}'});
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/plain', content: 'Hello {{name}}', is_template: true}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                        it('Should allow manual definition of the content and content type', function (done) {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com', {method: 'GET'}).andReturn({content: 'Hello World', contentType: 'text/plain'});
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/plain', content: 'Hello World'}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                    });
                    describe('Defaults', function () {
                        it('Should set the http_method to "GET" if not specified', function () {
                            proxy.define(function (p) {
                                p.stub('http://www.google.com').andReturn({text: 'Hello World'});
                            }, function () {
                                expect(stub.fn).toHaveBeenCalledWith('POST', correctRequest);
                                expect(JSON.parse(stub.fn.calls.argsFor(0)[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/plain', content: 'Hello World'}}));
                                done();
                            });
                            helper.sendServerResponse();
                        });
                    });
                });


            });

        });

    });
});