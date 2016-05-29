'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var distDirectory = './generators';

  grunt.initConfig({
    babel: {
      options: {
        // sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{
          cwd: './src/generators',
          expand: true,
          src: ['*/*.js', '*.js'],
          dest: distDirectory
        }]
      }
    },

    eslint: {
      target: ['src/generators/*/*.js', 'test/**/*.js']
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
          cwd: './src/generators',
          expand: true,
          src: ['**/templates/**'],
          dest: distDirectory
        }]
      }
    },

    clean: [distDirectory]
  });

  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('pre-publish', ['clean', 'eslint', 'babel', 'copy:templates']);
};
