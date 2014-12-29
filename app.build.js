({
    appDir: "./",
    baseUrl: "./",
    dir: "build",
    modules: [
        {
            name: "src/proxy"
        }
    ],
    removeCombined: true,
    fileExclusionRegExp: /^node_modules|^\.|^spec|^build\.txt|^karma|^package\.json|^test\-main\.js/,
    paths: {
        'sinon': 'bower_components/sinonjs/sinon',
        'underscore': 'bower_components/underscore/underscore',
        'string': 'bower_components/string/lib/string',
        'request': 'src/request'
    },
    shim: {
        'sinon': {
            exports: 'sinon'
        }
    },
    optimize: 'none',
    skipDirOptimize: true

})