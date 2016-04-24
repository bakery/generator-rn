import yeoman from 'yeoman-generator';
import lodash from 'lodash';
import s from 'underscore.string';
import changeCase from 'change-case';

lodash.mixin(s.exports());

module.exports = yeoman.Base.extend({
  constructor() {
    yeoman.Base.apply(this, arguments);
    this.helpers = {
      lodash,
      camelCase: changeCase.camel,
      snakeCase: changeCase.snake,
      dashCase: changeCase.param,
      kabobCase: changeCase.param,
      dotCase: changeCase.dot,
      pathCase: changeCase.path,
      properCase: changeCase.pascal,
      pascalCase: changeCase.pascal,
      lowerCase: changeCase.lower,
      sentenceCase: changeCase.sentence,
      constantCase: changeCase.constant,
      titleCase: changeCase.title
    };

    this.escodegenOptions = {
      format: {
        indent: {
          style: '  ',
          base: 0,
          adjustMultilineComment: false
        },
        newline: '\n',
        space: ' ',
        json: false,
        renumber: false,
        hexadecimal: false,
        quotes: 'single',
        escapeless: false,
        compact: false,
        parentheses: true,
        semicolons: true,
        safeConcatenation: false
      },
      moz: {
        starlessGenerator: false,
        parenthesizedComprehensionBlock: false,
        comprehensionExpressionStartsWithAssignment: false
      },
      parse: null,
      comment: false,
      sourceMap: undefined,
      sourceMapRoot: null,
      sourceMapWithCode: false,
      file: undefined,
      // sourceContent: originalSource,
      directive: false,
      verbatim: undefined
    };
  },

  getPromptsForAppDirectory() {
    const needsAppDirectory = !this.appDirectory;
    return needsAppDirectory ? [{
      type: 'input',
      name: 'appDirectory',
      message: 'What is the name of your app directory?',
      default: 'app',
      validate: value => {
        return (/^[$A-Z_][0-9A-Z_$]*$/i).test(value);
      }
    }] : [];
  }
});
