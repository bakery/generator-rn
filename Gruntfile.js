'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var distDirectory = 'lib';

  grunt.initConfig({
    babel: {
      options: {
        // sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          src: ['generators/*/*.js', 'generators/*.js'],
          dest: distDirectory
        }]
      }
    },

    eslint: {
      target: ['generators/*/*.js', 'test/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'babel-core/register'
        },
        src: ['test/**/*.js']
      }
    },

    copy: {
      templates: {
        files: [{
          expand: true,
          src: ['generators/**/templates/**'],
          dest: distDirectory
        }]
      }
    },

    clean: [distDirectory]
  });

  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('pre-publish', ['clean', 'eslint', 'babel', 'copy:templates']);
};
