/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    static: 'static',
    dist: '<%= build %>',
    tpl: 'template'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      imagemin:{
        files: ['<%%= config.static %>/img/{,*/}*.{png,jpg,gif}'],
        tasks: ['imagemin']
      },
      js: {
        files: ['<%%= config.static %>/js/{,*/}*.js'],
        tasks: ['jshint',
        <% if (includeBrowserify){%>
          'browserify'
        <% } else if (includeRequirejs) {%>
          'requirejs'
        <% } else { %>
          'uglify'
        <% } %>
        ]
      },
      less: {
        files: ['<%%= config.static %>/css/{,*/}*.less'],
        tasks: ['less', 'autoprefixer']
      }
    },
    // Empties folders to start fresh
    clean: {
      dist: ['<%%= config.dist %>']
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= config.static %>/js/{,*/}*.js'
      ]
    },
    <% if (includeLess) { %>
      less: {
        options: {
          compress: false
        },
        dist: {
          expand: true,
          cwd: '.',
          src: ['<%%= config.static %>/css/{,*/}/*.less'],
          dest: '<%%= config.dist %>',
          ext: '.css'
        }
      }, <% } else { %>
      //use yui to compress css
    cssmin: {
      dist: {
        expand: true,
        cwd: '.',
        src: ['<%%= config.static %>/css/{,*/}/*.css'],
        dest: '<%%= config.dist %>'
      }
    }, <% } %>
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['Explorer > 5', 'last 3 ExplorerMobile versions', 'Firefox > 3.6', 'Firefox ESR', 'Opera 12.1', 'Android > 2.2', 'last 4 iOS versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.dist %>',
          src: ['<%%= config.static %>/css/{,*/}*.css'],
          dest: '<%%= config.dist %>'
        }]
      }
    },
    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\.\./,
        src: ['<%%= config.tpl %>/{,*/}*.html']
      }
    },
    <% if (includeBrowserify) { %>
    browserify: {
        dist: {
          expand: true,
          cwd: '.',
          src: ['<%%= config.static %>/js/{,*/}/*.js'],
          dest: '<%%= config.dist %>'
        }
      },
      uglify: {
        dist: {
          expand: true,
          cwd: '<%%= config.dist %>',
          src: ['<%%= config.static %>/js/{,*/}/*.js'],
          dest: '<%%= config.dist %>'
        }
      }, <% } else if (includeRequirejs) { %>
    requirejs: {
      compile: {
        options: {
          baseUrl: '<%%= config.static %>/js',
          name: 'index',
          out: '<%%= config.dist %>/<%%= config.static %>/js/index.js'
        }
      }
    }, <% } else { %>
    uglify: {
      dist: {
        expand: true,
        cwd: '.',
        src: ['<%%= config.static %>/js/{,*/}/*.js'],
        dest: '<%%= config.dist %>'
      }
    }, <% } %>
    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.',
          src: '<%%= config.static %>/img{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>'
        }]
      }
    },
    copy: {
      html: {
        expand: true,
        cwd: '.',
        src: ['<%%= config.tpl %>/{,*/}/*.html'],
        dest: '<%%= config.dist %>'
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'jshint',
    <% if (includeBrowserify) { %>
      'browserify',
    <% } else if (includeRequirejs) { %>
      'requirejs',
    <% } else { %>
      'uglify',
    <% } %>
    <% if (includeLess) { %>
      'less',
    <% } else { %>
      'cssmin',
    <% } %>
    'autoprefixer',
    'imagemin',
    'wiredep',
    'copy:html'
  ]);
};