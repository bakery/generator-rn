import BaseGenerator from '../base';
// import esprima from 'esprima';
// import escodegen from 'escodegen';
import 'shelljs/global';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    this.selectorName = options.selectorName;
    this.appDirectory = this.config.get('appDirectory');
    this.selectorsDirectory = 'selectors';
  },

  prompting() {
    const done = this.async();
    const appDirectoryPrompts = this.getPromptsForAppDirectory();
    const prompts = [...appDirectoryPrompts];

    if (!this.selectorName) {
      prompts.push({
        type: 'input',
        name: 'selectorName',
        message: 'What should your selector be called?',
        default: 'state',
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

      if (answers.selectorName) {
        this.selectorName = answers.selectorName;
      }
      done();
    });
  },

  configuring: {
  },

  writing: {
    everything() {
      // const escodegenOptions = {
      //   format: {
      //     indent: {
      //       style: '  '
      //     }
      //   }
      // };
      this.template(
        'selector.js',
        `${this.appDirectory}/${this.selectorsDirectory}/${this.selectorName}.js`
      );

      //   const selectorsModule = esprima.parse('');
      //   selectorsModule.body.push(
      //     {
      //       type: 'ExportDefaultDeclaration',
      //       declaration: {
      //         type: 'ArrayExpression',
      //         elements: [
      //           {
      //             type: 'Identifier',
      //             name: 'bodySelector'
      //           },
      //           {
      //             type: 'Identifier',
      //             name: 'anotherSelector'
      //           }
      //         ]
      //       }
      //     }
      //   );

      //   this.write(`${this.appDirectory}/${this.selectorsDirectory}/index.js`,
      //     escodegen.generate(selectorsModule, escodegenOptions)
      //   );
      // }
    }
  },

  install: {

  }
});
