module.exports = function(grunt) {
    var shell;
    shell = require('shelljs');
    grunt.initConfig({
        browserify: {
            options: {
                browserifyOptions: {
                    standalone: 'AgileProxy'
                }
            },
            production: {
                dest: 'dist/AgileProxy.js',
                src: 'src/AgileProxy.js'
            }
        },
        karma: {
            development: {
                configFile: 'karma.conf.js',
                files: [
                    {pattern: 'bower_components/sinonjs/**/*.js'},
                    {pattern: 'bower_components/underscore/**/*.js', included: false},
                    {pattern: 'bower_components/string/**/*.js', included: false},
                    {pattern: 'spec/support/**/*.js'},
                    {pattern: 'spec/**/*Spec.js'},
                    {pattern: 'spec/**/*SpecHelper.js'}
                ],
                singleRun: true
            },
            production: {
                configFile: 'karma.conf.js',
                files: [
                    {pattern: 'bower_components/sinonjs/**/*.js'},
                    {pattern: 'bower_components/underscore/**/*.js', included: false},
                    {pattern: 'bower_components/string/**/*.js', included: false},
                    {pattern: 'dist/AgileProxy.js', included: true},
                    {pattern: 'spec/support/**/*.js'},
                    {pattern: 'spec/**/*Spec.js'},
                    {pattern: 'spec/**/*SpecHelper.js'}
                ],
                singleRun: true,
                browsers: ['PhantomJS'],
                browserify: {
                    configure: function (bundle) {
                        bundle.on('prebundle', function () {
                            bundle.ignore('nock');
                            bundle.ignore('sinon');
                            bundle.external('src/AgileProxy.js');  //Prevents the source code from being used during this test
                        });
                    },
                    debug: true
                }

            }
        }

    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('jasmine:production', 'Run the jasmine suite for the nodejs code', function () {
        shell.exec('./node_modules/jasmine/bin/jasmine.js');
    });
    grunt.registerTask('buildAndTest', 'Build the browser version and test browser and node versions', [
        'browserify:production',
        'karma:production',
        'jasmine:production'
    ]);
};
