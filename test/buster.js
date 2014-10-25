var config = module.exports;

config['development'] = {
	environment: 'browser'
    , rootPath: '../'
    , deps: [
        'bower_components/jquery/jquery.js'
    ]
    , sources: ['src/simpleUri.js']
    , specs: ['test/spec/**/*.js']
    , extensions: [ require('buster-coverage') ]
    , "buster-coverage": {
        outputDirectory: "test/coverage"
        , format: "lcov"
        , combinedResultsOnly: true
    }
};