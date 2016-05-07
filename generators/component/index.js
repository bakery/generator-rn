import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.componentName = options.componentName;
    this.isContainer = options.isContainer;
    this.componentName = options.componentName;
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
          return this.namingConventions.componentName.regEx.test(value);
        }
      });
    }

    prompts.push({
      type: 'list',
      name: 'boilerplate',
      message: 'Which boilerplate do you want to use?',
      default: 'Vanila',
      choices: () => {
        return this._listAvailableBoilerPlates();
      }
    });

    if (prompts.length === 0) {
      done();
      return;
    }

    this.prompt(prompts, answers => {
      if (answers.componentName) {
        this.componentName = answers.componentName;
      }

      this.boilerplate = answers.boilerplate;
      done();
    });
  },

  configuring: {
    files() {
      this.componentName = this.namingConventions.componentName.clean(
        this.componentName
      );

      this.files = [
        'index.js.hbs',
        'test.js.hbs',
        'styles.js.hbs'
      ];
    }
  },

  writing: {
    everything() {
      const componentOrContainer = this.isContainer ? 'containers' : 'components';
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/${componentOrContainer}/${this.componentName}/${this._dropHBSExtension(f)}`);
      });
    }
  }
});
