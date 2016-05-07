import BaseGenerator from '../base';
import 'shelljs/global';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.selectorsDirectory = 'selectors';
    this.selectorName = options.selectorName;
    this.containerName = options.containerName;
    this.reducer = this.namingConventions.reducerName.clean(
      this.containerName
    );
  },

  prompting() {
    const done = this.async();
    const prompts = [];

    if (!this.selectorName) {
      const defaultSelectorName = this.reducer ?
        this.namingConventions.selectorName.clean(this.reducer) :
        'state';

      prompts.push({
        type: 'input',
        name: 'selectorName',
        message: 'What should your selector be called?',
        default: defaultSelectorName,
        validate: value => {
          return this.namingConventions.selectorName.regEx.test(value);
        }
      });
    }

    if (prompts.length === 0) {
      done();
      return;
    }

    this.prompt(prompts, answers => {
      if (answers.selectorName) {
        this.selectorName = answers.selectorName;
      }
      done();
    });
  },

  writing: {
    everything() {
      this.selectorName = this.namingConventions.selectorName.clean(this.selectorName);
      const selectorPath = `${this.appDirectory}/${this.selectorsDirectory}/${this.selectorName}.js`;

      if (!this._fileExists(this.destinationPath(selectorPath))) {
        this.template('selector.js.hbs', selectorPath);
      }
    }
  }
});
