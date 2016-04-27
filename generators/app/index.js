/* globals which: false */

// import yeoman from 'yeoman-generator';
import BaseGenerator from '../base';
import chalk from 'chalk';
import yosay from 'yosay';
import 'shelljs/global';
import fs from 'fs';

module.exports = BaseGenerator.extend({

  initializing() {
    if (!this._checkIfRNIsInstalled()) {
      this.env.error('No React Native found: start by installing it https://facebook.github.io/react-native/docs/getting-started.html#quick-start');
    }

    this.log(yosay(
      'Welcome to the sublime ' + chalk.red('Reactive Native') + ' generator!'
    ));
  },

  prompting() {
    const done = this.async();

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What should your app be called?',
        default: 'MyReactApp',
        validate: value => {
          return (/^[$A-Z_][0-9A-Z_$]*$/i).test(value);
        }
      }
    ];

    this.prompt(prompts, answers => {
      this.applicationName = answers.name;
      done();
    });
  },

  makeSureDestinationDirectoryIsNotOccupiedAlready() {
    // check to see if destination directory is empty or not
    // if it's empty -> go ahead and do the thing
    // if not empty -> create a folder and use it as cwd

    const filesInDestinationDirectory = fs.readdirSync(this.destinationPath('.'));
    if (filesInDestinationDirectory.length !== 0) {
      fs.mkdirSync(this.destinationPath(this.applicationName));
      this.destinationRoot(this.destinationPath(this.applicationName));
    }
  },

  writing: {
    packageJSON() {
      this.fs.writeJSON(
        this.destinationPath('package.json'),
        {
          name: this.applicationName,
          version: '1.0.0',
          description: 'React Native app powered by Baker',
          main: 'index.js',
          engines: {
            node: '>=4.3'
          },
          dependencies: {
            'react-native': '^0.23.1',
            'react-redux': '^4.4.5',
            'redux': '^3.4.0',
            'redux-immutable': '^3.0.6',
            'redux-saga': '^0.9.5',
            'reselect': '^2.4.0'
          },
          devDependencies: {
            'babel-eslint': '^6.0.2',
            'babel-polyfill': '^6.7.4',
            'eslint': '^2.8.0',
            'eslint-loader': '^1.3.0',
            'eslint-plugin-react': '^4.3.0',
            'remote-redux-devtools': '^0.1.6'
          }
        }
      );
    },

    eslint() {
      this.template('eslintrc', '.eslintrc');
    }
  },

  install: {
    setupRN() {
      this.installDependencies({
        bower: false,
        callback: () => {
          this._initRN();
        }
      });
    }
  },

  end() {
    this.conflicter.force = true;

    ['ios', 'android'].forEach(platform => {
      this.template(
        this.templatePath('index.ejs'),
        this.destinationPath(`index.${platform}.js`),
        {
          applicationName: this.applicationName,
          appDirectory: this.appDirectory
        }
      );
    });

    this.bulkDirectory('app', this.appDirectory);

    this.composeWith('container', {
      options: {
        name: 'App'
      }
    }, {
      local: require.resolve('../container')
    });
  },

  _checkIfRNIsInstalled() {
    return which('react-native');
  },

  _initRN() {
    this.spawnCommandSync('node', [
      this.templatePath('setup-rn.js'),
      this.destinationRoot(),
      this.applicationName
    ]);
  }
});
