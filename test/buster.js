var config = module.exports;

config['development'] = {
	env: 'browser'
    , rootPath: '../'
    , deps: [
        'bower_components/jquery/jquery.js'
    ]
    , sources: ['src/simpleUri.js']
    , specs: ['test/spec/**/*.js']
    , extensions: [ require('buster-istanbul') ]
    , "buster-istanbul": {
        outputDirectory: "test/coverage"
        , format: "lcov"
    }
};
