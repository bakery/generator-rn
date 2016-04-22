import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.containerName = options.name;
    this.appDirectory = this.config.get('appDirectory');
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

    if (!this.containerName) {
      prompts.push({
        type: 'input',
        name: 'containerName',
        message: 'What should your container be called?',
        default: 'MyNewContainer',
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

      if (answers.containerName) {
        this.containerName = answers.containerName;
      }
      done();
    });
  },

  configuring: {
    files() {
      this.files = [
        'actions.js',
        'actions.test.js',
        'constants.js',
        'index.js',
        'reducer.js',
        'reducer.test.js',
        'selector.js',
        'test.js'
      ];
    }
  },

  writing: {
    everything() {
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/containers/${this.containerName}/${f}`);
      });
    }
  },

  install: {

  }
});
