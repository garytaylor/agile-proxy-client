// Karma configuration
// Generated on Fri Dec 26 2014 22:23:14 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'bower_components/sinonjs/**/*.js'},
      {pattern: 'bower_components/sinon_server/**/*.js'},
      {pattern: 'bower_components/underscore/**/*.js', included: false},
      {pattern: 'bower_components/string/**/*.js', included: false},
      {pattern: 'dist/AgileProxy.js', included: true},
      {pattern: 'spec/support/**/*.js'},
      {pattern: 'spec/**/*Spec.js'},
      {pattern: 'spec/**/*SpecHelper.js'}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/**/*.js': ['browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    browserify: {
      configure: function (bundle) {
        bundle.on('prebundle', function () {
          bundle.ignore('nock');
          bundle.ignore('sinon');
        });
      },
      debug: true
    }
  });
};
