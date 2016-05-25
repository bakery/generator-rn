import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.componentName = options.componentName;
    this.isContainer = options.isContainer;
    this.componentName = options.componentName;
    this.selectorName = options.selectorName;
    this.boilerplate = options.boilerplate;

    if (options.destinationRoot) {
      this.destinationRoot(options.destinationRoot);
    }

    this.Handlebars.registerPartial('mapDispatchAndPropsAndConnect',
      this.read(this.templatePath('mapDispatchPropsAndConnect.js.hbs'))
    );
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

    if (!this.boilerplate) {
      prompts.push({
        type: 'list',
        name: 'boilerplate',
        message: 'Which boilerplate do you want to use?',
        default: 'Vanila',
        choices: () => {
          return this._listAvailableBoilerPlates();
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
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/components/${this.componentName}/${this._dropHBSExtension(f)}`);
      });
    }
  }
});
