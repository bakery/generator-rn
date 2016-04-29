import BaseGenerator from '../base';
import esprima from 'esprima';
import escodegen from 'escodegen';
import _ from 'lodash';

module.exports = BaseGenerator.extend({
  prompting() {
    const done = this.async();
    const prompts = [{
      type: 'input',
      name: 'sagaName',
      message: 'What should your saga be called?',
      default: 'talkToServer',
      validate: value => {
        return (/^[$A-Z_][0-9A-Z_$]*$/i).test(value);
      }
    }];

    this.prompt(prompts, answers => {
      this.sagaName = answers.sagaName;
      done();
    });
  },

  writing: {
    sagaFile() {
      this.template('saga.js.hbs', `${this.appDirectory}/sagas/${this.sagaName}.js`);
    },

    updateSagasIndex() {
      const sagasIndex = this.destinationPath(`${this.appDirectory}/sagas/index.js`);
      let sagasIndexContent;
      let sagasModule;

      if (this._fileExists(sagasIndex)) {
        sagasIndexContent = this._readFile(sagasIndex);
      } else {
        sagasIndexContent = this._readFile(this.templatePath('index.js'));
      }

      try {
        sagasModule = esprima.parse(sagasIndexContent, {sourceType: 'module'});
      } catch (e) {
        this.env.error(`There seems to be an issue with your sagas module (${sagasIndex})`, e);
        return;
      }

      // add import statement to the top of the
      // sagas index module to include new saga
      sagasModule.body = [{
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: this.sagaName
            },
            imported: {
              type: 'Identifier',
              name: this.sagaName
            }
          }
        ],
        source: {
          type: 'Literal',
          value: `./${this.sagaName}`,
          raw: `'./${this.sagaName}'`
        }
      }, ...sagasModule.body];

      const exportDeclaration = _.find(sagasModule.body, d => {
        return d.type === 'ExportDefaultDeclaration' &&
          d.declaration && d.declaration.type === 'ArrayExpression';
      });

      if (!exportDeclaration) {
        this.env.error(
          `There seems to be an issue with your sagas module (${sagasIndex}) - invalid export declaration`
        );
        return;
      }

      exportDeclaration.declaration.elements.push({
        type: 'Identifier',
        name: this.sagaName
      });

      try {
        // XX: for some odd reason passing a 'normal' AST
        // produced by esprima causes escodegen to throw
        const statements = sagasModule.body.map(s => {
          const str = escodegen.generate(s, this.escodegenOptions);
          return str;
        });

        this.write(sagasIndex, statements.join('\n'));
      } catch (e) {
        console.error('error generating sagas/index.js', e);
      }
    }
  }
});
