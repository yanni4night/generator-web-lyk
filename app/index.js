/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-11-14[23:45:45]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

"use strict";

var generators = require('yeoman-generator');
var chalk = require('chalk');

module.exports = generators.Base.extend({
    build: 'build',
    constructor: function() {
        generators.Base.apply(this, arguments);

        this.pkg = require('../package.json');
    },
    askFor: function() {

        var done = this.async();

        var prompts = [{
            type: 'checkbox',
            name: 'features',
            message: 'What more would you like?',
            validate: function(input) {
                var selects = Array.prototype.join.call(arguments);

                if (~selects.indexOf('includeRequirejs') && ~selects.indexOf('includeBrowserify')) {
                    return chalk.red('You cannot use Requirejs and Browerify at the same time');
                }
                return true;
            },
            choices: [{
                name: 'Less',
                value: 'includeLess',
                checked: true
            }, {
                name: 'jQuery',
                value: 'includeJquery',
                checked: true
            }, {
                name: 'Browserify',
                value: 'includeBrowserify',
                checked: true
            }, {
                name: 'Angularjs',
                value: 'includeAngularjs',
                checked: false
            }, {
                name: 'Requirejs',
                value: 'includeRequirejs',
                checked: false
            }, {
                name: 'Swig',
                value: 'includeSwig',
                checked: false
            }]
        }, {
            when: function(answers) {
                return answers && answers.features &&
                    ~answers.features.indexOf('includeJquery');
            },
            type: 'confirm',
            name: 'jquery1.x',
            value: 'jquery1.x',
            message: 'Would you like to use jQuery 1.x for old browers?',
            default: true
        }, {
            when: function(answers) {
                return answers && answers.features &&
                    ~answers.features.indexOf('includeRequirejs');
            },
            type: 'confirm',
            name: 'requirejs-text',
            value: 'includeRequirejsText',
            message: 'Would you like to use the text plugin for Requirejs?',
            default: true
        }];

        this.prompt(prompts, function(answers) {
            var features = answers.features;

            function hasFeature(feat) {
                return features && ~features.indexOf(feat);
            }

            this.includeLess = hasFeature('includeLess');
            this.includeBrowserify = hasFeature('includeBrowserify');
            this.includeAngularjs = hasFeature('includeAngularjs');
            this.includeRequirejs = hasFeature('includeRequirejs');
            this.includeJquery = hasFeature('includeJquery');
            this.includeSwig = hasFeature('includeSwig');

            this.useJquery1x = answers['jquery1.x'];
            this.includeRequirejsText = answers['requirejs-text'];

            done();
        }.bind(this));
    },
    git: function() {
        this.template('gitignore', '.gitignore');
        this.copy('gitattributes', '.gitattributes');
    },
    packageJSON: function() {
        this.template('_package.json', 'package.json');
    },
    jshint: function() {
        this.copy('jshintrc', '.jshintrc');
    },
    editorConfig: function() {
        this.copy('editorconfig', '.editorconfig');
    },
    bower: function() {
        var bower = {
            name: this._.slugify(this.appname),
            private: true,
            dependencies: {}
        };

        if (this.includeAngularjs) {
            bower.dependencies.angular = "~1.3.2";
        }

        if (this.includeJquery) {
            bower.dependencies.angular = this.useJquery1x ? "~1.11.1" : "2.1.1";
        }

        if (this.includeRequirejs) {
            bower.dependencies.requirejs = "~2.1.15";
            if (this.includeRequirejsText) {
                bower.dependencies['requirejs-text'] = "~2.0.12";
            }
        }

        this.copy('bowerrc', '.bowerrc');
        this.write('bower.json', JSON.stringify(bower, null, 2));
    },
    static: function() {
        this.directory('static');
    },
    stylesheet: function() {
        this.template('index.css', 'static/css/index.' + (this.includeLess ? 'le' : 'c') + 'ss');
    },
    javascript: function() {
        this.template('index.js', 'static/js/index.js');
    },
    html: function() {
        this.mkdir('template');
        this.template('index.html', 'template/' + (this.includeSwig ? 'parent' : 'index') + '.html');
    }

    /*,
                gruntfile: function() {
                    this.template('Gruntfile.js');
                }*/
});