module.exports = function(grunt) {
    var shell;
    shell = require('shelljs');
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    appDir: "./",
                    baseUrl: "./",
                    dir: "build",
                    modules: [
                        {
                            name: "almond",
                            include: ["src/proxy"]
                        }
                    ],
                    removeCombined: true,
                    fileExclusionRegExp: /^node_modules|^\.|^spec|^build\.txt|^karma|^package\.json|^test\-main\.js/,
                    paths: {
                        'sinon': 'bower_components/sinonjs/sinon',
                        'underscore': 'bower_components/underscore/underscore',
                        'string': 'bower_components/string/lib/string',
                        'request': 'src/request',
                        'almond': 'bower_components/almond/almond'
                    },
                    shim: {
                        'sinon': {
                            exports: 'sinon'
                        }
                    },
                    optimize: 'none',
                    skipDirOptimize: true,
                    done: function(done, output) {
                        grunt.log.success("No duplicates found!");
                        done();
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('build:copyToDist', 'Build all', function () {
        shell.mkdir('dist');
        shell.cp('build/src/proxy.js', 'dist/');
    });
};
