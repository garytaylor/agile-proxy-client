define(function (require) {
    var _, proxy, restPort, spec1Request, spec2Request, freeport, helper;
    describe('AgileProxyClient', function () {
        beforeEach(function () {
            restPort = 4000;
            proxy = new (require('src/proxy'))();
            helper = require('./AgileProxyClientSpecHelper');
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
                var stub;
                beforeEach(function () {
                    helper.stubRequest('POST', '/v1/users/1/applications/1/request_specs');
                    stub = helper.getStubbedRequest('POST', '/v1/users/1/applications/1/request_specs');
                    spyOn(stub, 'fn').and.returnValue({body: JSON.stringify(helper.getCreatedStub())});
                });
                it('Should send multiple stubs in series using define', function () {
                    var call1, call2;
                    proxy.define(function (p) {
                        p.stub('http://www.google.com', {method: 'GET'}).andReturn({text: 'I am not google'});
                        p.stub('http://mydomain.com/users', {method: 'POST'}).andReturn({json: {name: 'Test User', id: 10}});
                    });
                    helper.sendServerResponse();
                    expect(stub.fn.calls.count()).toEqual(2);
                    call1 = stub.fn.calls.argsFor(0);
                    call2 = stub.fn.calls.argsFor(1);
                    expect(call1[0]).toEqual('POST');
                    expect(call1[1]).toEqual(jasmine.objectContaining({url: 'http://localhost:' + restPort + '/v1/users/1/applications/1/request_specs', headers: jasmine.objectContaining({'Content-Type': 'application/json;charset=utf-8'})}));
                    expect(JSON.parse(call1[1].body)).toEqual(jasmine.objectContaining({url: 'http://www.google.com', http_method: 'GET', response: {content_type: 'text/plain', content: 'I am not google'}}));
                    expect(call2[0]).toEqual('POST');
                    expect(call2[1]).toEqual(jasmine.objectContaining({url: 'http://localhost:' + restPort + '/v1/users/1/applications/1/request_specs', headers: jasmine.objectContaining({'Content-Type': 'application/json;charset=utf-8'})}));
                    expect(JSON.parse(call2[1].body)).toEqual(jasmine.objectContaining({url: 'http://mydomain.com/users', http_method: 'POST', response: {content_type: 'application/json', content: '{"name":"Test User","id":10}'}}));
                });


            });

        });

    });
});
