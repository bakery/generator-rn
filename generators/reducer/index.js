import BaseGenerator from '../base';
import fs from 'fs';
import esprima from 'esprima';
import escodegen from 'escodegen';
import _ from 'lodash';

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
        reducersModuleContent = fs.readFileSync(reducersModulePath).toString();
      } catch (e) {
        reducersModuleContent = this.read(this.templatePath('reducers.js'));
      }

      try {
        reducersModule = esprima.parse(reducersModuleContent, {sourceType: 'module'});
      } catch (e) {
        this.env.error(`There seems to be an issue with your reducers module (${this.destinationPath(reducersModulePath)})`, e);
        return;
      }

      // add import statement to the top of the
      // reducers module including new reducer
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

      // add new reducer to the module export
      // find top level var called applicationReducers
      // add new reducer to init.properties

      let applicationReducersVar = _.find(reducersModule.body, d => {
        return d.type === 'VariableDeclaration' &&
          d.declarations[0].id.name === 'applicationReducers';
      });

      if (applicationReducersVar) {
        applicationReducersVar.declarations[0].init.properties.push({
          type: 'Property',
          key: {
            type: 'Identifier',
            name: this.container
          },
          computed: false,
          value: {
            type: 'Identifier',
            name: `${this.container}Reducer`
          },
          kind: 'init',
          method: false,
          shorthand: false
        });
      } else {
        // XX: this should not happen normally
        // unless applicationReducers got moved somewhere, deleted
        this.env.error('Your reducers.js module is missing applicationReducers var');
        return;
      }

      try {
        // XX: for some odd reason passing a 'normal' AST
        // produced by esprima causes escodegen to throw
        const statements = reducersModule.body.map(s => {
          const str = escodegen.generate(s, this.escodegenOptions);
          return str;
        });

        this.conflicter.ignore = true;
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
