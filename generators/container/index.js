import BaseGenerator from '../base';
import SelectorUtilities from '../selector/utils';

const NEW_SELECTOR_PROMPT = 'New Selector';
const NO_SELECTOR_PROMPT = 'No Selector';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.containerName = options.name;
    this.selectorName = null;
  },

  prompting() {
    const done = this.async();
    const prompts = [];

    if (!this.containerName) {
      prompts.push({
        type: 'input',
        name: 'containerName',
        message: 'What should your container be called?',
        default: 'MyNewContainer',
        validate: value => {
          return this.namingConventions.componentName.regEx.test(value);
        }
      });
    }

    prompts.push({
      type: 'confirm',
      name: 'addReducer',
      message: 'Do you want a reducer + actions + constants generated?',
      default: true
    });

    prompts.push({
      type: 'list',
      name: 'containerSelectorName',
      message: 'Which selector do you want to use?',
      choices: () => {
        return [
          ...SelectorUtilities.getExistingSelectors(this),
          NEW_SELECTOR_PROMPT,
          NO_SELECTOR_PROMPT
        ];
      }
    });

    prompts.push({
      type: 'input',
      name: 'selectorName',
      message: 'What is the name for the new selector?',
      default: 'data',
      validate: value => {
        return (/^[$A-Z_][0-9A-Z_$]*$/i).test(value);
      },
      when: answers => answers.containerSelectorName === 'New Selector'
    });

    if (prompts.length === 0) {
      done();
      return;
    }

    this.prompt(prompts, answers => {
      if (answers.containerName) {
        this.containerName = answers.containerName;
      }

      if (answers.containerSelectorName === NEW_SELECTOR_PROMPT) {
        this.selectorName = answers.selectorName;
        this.composeWith('selector', {
          options: {
            selectorName: answers.selectorName
          }
        }, {
          local: require.resolve('../selector')
        });
      } else if (answers.containerSelectorName !== NO_SELECTOR_PROMPT) {
        this.selectorName = answers.containerSelectorName;
      }

      this.addReducer = answers.addReducer;

      done();
    });
  },

  configuring: {
    files() {
      this.containerName = this.namingConventions.componentName.clean(this.containerName);

      this.files = [
        'index.js',
        'test.js'
      ];
    }
  },

  writing: {
    component() {
      let options = {
        componentName: this.containerName,
        isContainer: true
      };

      if (this.selectorName !== NO_SELECTOR_PROMPT) {
        options.selectorName = this.selectorName;
      }

      this.composeWith('rn:component', {options}, {
        local: require.resolve('../component')
      });
    },

    reducer() {
      if (this.addReducer) {
        this.composeWith('rn:reducer', {
          options: {
            container: this.containerName
          }
        }, {
          local: require.resolve('../reducer')
        });
      }
    }
  }
});
