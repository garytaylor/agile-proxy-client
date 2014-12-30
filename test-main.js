var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
    'sinon': 'bower_components/sinonjs/sinon',
    'underscore': 'bower_components/underscore/underscore',
    'string': 'bower_components/string/lib/string',
    'request': 'src/request',
    'AgileProxy': 'dist/AgileProxy'
  },
  shim: {
    'sinon': {
      exports: 'sinon'
    },
    'AgileProxy': {
      exports: 'AgileProxy'
    }
  },


  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
