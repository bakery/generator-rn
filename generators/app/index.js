/* globals which: false */

import yeoman from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import 'shelljs/global';

class Generator extends yeoman.Base {

  get initializing() {
    return {
      checkEnvironment() {
        if (!this._checkIfRNIsInstalled()) {
          this.env.error('No React Native found: start by installing it https://facebook.github.io/react-native/docs/getting-started.html#quick-start');
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
    return which('react-native');
  }

  // install: function () {
  //   this.installDependencies();
  // }
}

module.exports = Generator;
