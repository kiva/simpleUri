'use strict';


module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')


        , meta: {
            version: '<%= pkg.version %>'
            , banner:
                '/**\n' +
                '* simpleUri v<%= meta.version %>\n' +
                '* <%= pkg.description %>\n' +
                '*\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> Kiva Microfunds\n' +
                '* Licensed under the MIT license.\n' +
                '* https://github.com/kiva/simpleUri/blob/master/license.txt\n' +
                '*/\n'
        }


        , buster: {
            test: {
                reporter: 'specification'
            }
        }


        , jshint: {
            options: {
                jshintrc: '.jshintrc'
            }
            , all: ['src/*.js', 'test/spec/**/*.js']
        }


        , uglify: {
            target: {
                options: {
                    banner: '<%= meta.banner %>'
                }
                , files: {
                    'dist/simpleUri.min.js': ['dist/simpleUri.js']
                    , 'dist/amd/simpleUri.min.js': ['dist/amd/simpleUri.js']
                }
            }
        }


        , rig: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'dist/simpleUri.js': ['build/core.js']
                    , 'dist/amd/simpleUri.js': ['build/core.amd.js']
                    , 'dist/common/simpleUri.js': ['build/core.common.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rigger');

    grunt.registerTask('test', ['jshint', 'buster']);
    grunt.registerTask('build', ['jshint', 'buster', 'rig', 'uglify']);
};