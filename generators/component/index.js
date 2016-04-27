import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);
    this.componentName = options.componentName;
    this.isContainer = options.isContainer;
    this.selectorName = options.selectorName;
    if (options.destinationRoot) {
      this.destinationRoot(options.destinationRoot);
    }
  },

  prompting() {
    const done = this.async();
    const prompts = [];

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
        'test.js',
        'styles.js'
      ];
    }
  },

  writing: {
    everything() {
      const componentOrContainer = this.isContainer ? 'containers' : 'components';
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/${componentOrContainer}/${this.componentName}/${f}`);
      });
    }
  }
});
