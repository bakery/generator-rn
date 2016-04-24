import BaseGenerator from '../base';
import fs from 'fs';
import esprima from 'esprima';
import escodegen from 'escodegen';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.apply(this, arguments);

    if (!options || !options.container) {
      // XX: reducer generator is currently only meant
      // to be used through composeWith
      this.env.error('container option is required in reducer generator');
      return;
    }

    this.appDirectory = this.config.get('appDirectory') || options.appDirectory;
    this.container = options.container;
  },

  configuring: {
    files() {
      this.files = [
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ];
    }
  },

  writing: {
    everything() {
      this.files.forEach(f => {
        this.template(f, `${this.appDirectory}/containers/${this.container}/${f}`);
      });
    },

    updateRootReducersModule() {
      const reducersModulePath = `${this.appDirectory}/reducers.js`;
      let reducersModuleContent;
      let reducersModule;

      try {
        fs.statSync(this.destinationPath(reducersModulePath));
        reducersModuleContent = this.read(reducersModulePath);
      } catch (e) {
        reducersModuleContent = this.read(this.templatePath('reducers.js'));
      }

      try {
        reducersModule = esprima.parse(reducersModuleContent, {sourceType: 'module'});
      } catch (e) {
        this.env.error(`There seems to be an issue with your reducers module (${this.destinationPath(reducersModulePath)})`, e);
        return;
      }

      reducersModule.body = [{
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: `${this.container}Reducer`
            },
            imported: {
              type: 'Identifier',
              name: `${this.container}Reducer`
            }
          }
        ],
        source: {
          type: 'Literal',
          value: `./containers/${this.container}/reducer`,
          raw: `'./containers/${this.container}/reducer'`
        }
      }, ...reducersModule.body];

      try {
        const statements = reducersModule.body.map(s => {
          const str = escodegen.generate(s, this.escodegenOptions);
          return str;
        });

        this.write(
          this.destinationPath(reducersModulePath),
          statements.join('\n')
        );
      } catch (e) {
        console.error('error generating reducers.js', e);
      }
    }
  }
});
