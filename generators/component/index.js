import BaseGenerator from '../base';
// import fs from 'fs';
// import _ from 'lodash';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);
    this.appDirectory = this.config.get('appDirectory') || options.appDirectory;
    this.componentName = options.componentName;
    this.isContainer = false;
    this.selectorName = null;
  },

  prompting() {
    const done = this.async();
    const prompts = [];

    if (!this.appDirectory) {
      prompts.push({
        type: 'input',
        name: 'appDirectory',
        message: 'What is the name of your app directory?',
        default: 'app',
        validate: value => {
          return (/^[$A-Z_][0-9A-Z_$]*$/i).test(value);
        }
      });
    }

    if (!this.componentName) {
      prompts.push({
        type: 'input',
        name: 'componentName',
        message: 'What should your component be called?',
        default: 'MyNewComponent',
        validate: value => {
          return (/^[$A-Z_][0-9A-Z_$]*$/i).test(value);
        }
      });
    }

    if (prompts.length === 0) {
      done();
      return;
    }

    this.prompt(prompts, answers => {
      if (answers.appDirectory) {
        this.appDirectory = answers.appDirectory;
      }

      if (answers.componentName) {
        this.componentName = answers.componentName;
      }

      done();
    });
  },

  configuring: {
    files() {
      this.files = [
        'index.js',
        'test.js'
      ];
    }
  },

  writing: {
    everything() {
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/components/${this.componentName}/${f}`);
      });
    }
  }
});
