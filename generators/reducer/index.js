import BaseGenerator from '../base';
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

    this.container = options.container;
  },

  configuring: {
    files() {
      this.files = [
        'actions.js.hbs',
        'actions.test.js.hbs',
        'constants.js.hbs',
        'reducer.js.hbs',
        'reducer.test.js.hbs'
      ];
    }
  },

  writing: {
    everything() {
      this.files.forEach(f => {
        this.template(f, `${this.appDirectory}/containers/${this.container}/${this._dropHBSExtension(f)}`);
      });
    },

    updateRootReducersModule() {
      const reducersModulePath = `${this.appDirectory}/reducers.js`;
      let reducersModuleContent;
      let reducersModule;

      if (this._fileExists(this.destinationPath(reducersModulePath))) {
        reducersModuleContent = this._readFile(reducersModulePath);
      } else {
        reducersModuleContent = this.read(this.templatePath('reducers.js.hbs'));
      }

      try {
        // reducersModule = esprima.parse(reducersModuleContent, this.esprimaOptions);
        reducersModule = this.parseJSSource(reducersModuleContent);
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
        const statements = escodegen.generate(reducersModule, this.escodegenOptions);
        this.conflicter.ignore = true;
        this.write(
          this.destinationPath(reducersModulePath),
          statements
        );
      } catch (e) {
        console.error('error generating reducers.js', e);
      }
    }
  }
});
