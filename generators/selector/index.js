import BaseGenerator from '../base';
import 'shelljs/global';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.reducer = options.reducer;
    this.selectorName = options.selectorName;
    this.selectorsDirectory = 'selectors';
  },

  prompting() {
    const done = this.async();
    const prompts = [];

    if (!this.selectorName) {
      prompts.push({
        type: 'input',
        name: 'selectorName',
        message: 'What should your selector be called?',
        default: 'state',
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

      this.template(
        'selector.js.hbs',
        `${this.appDirectory}/${this.selectorsDirectory}/${this.selectorName}.js`
      );
    }
  }
});
