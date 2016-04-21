'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

class Generator extends yeoman.Base {

  get initializing() {
    return {
      checkEnvironment() {
        if (!this._checkIfRNIsInstalled()) {
          this.env.error("something bad is happened");
        }
      }
    };
  }

  prompting() {
    // var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the sublime ' + chalk.red('generator-rn') + ' generator!'
    ));

    // var prompts = [{
    //   type: 'confirm',
    //   name: 'someAnswer',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }];

    // this.prompt(prompts, function (props) {
    //   this.props = props;
    //   // To access props later use this.props.someAnswer;

    //   done();
    // }.bind(this));
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  _checkIfRNIsInstalled() {
    console.error('checking if RN is installed');
    return false;
  }

  // install: function () {
  //   this.installDependencies();
  // }
}

module.exports = Generator;
