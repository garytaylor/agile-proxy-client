Agile Proxy Client
==================

A browser or nodejs based client to access an agile-proxy (https://github.com/garytaylor/agileproxy) server in tests etc..

## Overview

If you are not familiar with agile-proxy, please see (https://github.com/garytaylor/agileproxy) to find out more.  In summary, it allows stubbing of HTTP requests even across processes such as selenium or other in browser test suites.

This is a client 'driver' for use within your tests which can do various tasks such as :-
* Add HTTP stubs with associated responses

Future functionality includes:
* Tracking of which http stubs have been requested by the application under test.

## Example

The code below uses jasmine, but this could be just as easily applied to others.

```javascript
  beforeEach(function (done) {
    proxy = new AgileProxy.Proxy();
    proxy.config({
                    proxyUrl: '',
                    restUrl: 'http://localhost:3020'
                });
    proxy.define(function (p) {
      p.stub('http://www.google.com', {method: 'GET'}).andReturn({text: 'I am not google'});
      p.stub('http://mydomain.com/users', {method: 'POST'}).andReturn({json: {name: 'Test User', id: 10}});
    }, function () {
      done()
    });
  });
  it('Should do something', function () {
    // Code which drives a browser for example to fetch 'http://www.google.com'
    //it should get back 'I am not google'
  });

```

## History
0.0.1 - Initial release to github
0.0.2 - Integrated travis
0.0.3 - Released to npm and bower
