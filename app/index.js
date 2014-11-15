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
    constructor: function() {
        generators.Base.apply(this, arguments);

        this.pkg = require('../package.json');
    },
    askFor: function() {

        var done = this.async();

        var prompts = {
            type: 'checkbox',
            name: 'features',
            message: 'What more would you like?',
            choices: [{
                name: 'Less',
                value: 'includeLess',
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
        };

        this.prompt(prompts, function(answers) {
            var features = answers.features;

            function hasFeature(feat) {
                return features && ~features.indexOf(feat);
            }

            this.includeLess = hasFeature('includeLess');
            this.includeBrowserify = hasFeature('includeBrowserify');
            this.includeAngularjs = hasFeature('includeAngularjs');
            this.includeRequirejs = hasFeature('includeRequirejs');
            this.includeSwig = hasFeature('includeSwig');

            done();
        }.bind(this));
    }
});