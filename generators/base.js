import yeoman from 'yeoman-generator';
import _ from 'lodash';
import s from 'underscore.string';
import changeCase from 'change-case';
import fs from 'fs';
import Handlebars from 'handlebars';

_.mixin(s.exports());

module.exports = yeoman.Base.extend({
  constructor() {
    yeoman.Base.apply(this, arguments);

    this.appDirectory = 'app';

    this.helpers = {
      _,
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

    this.template = (source, destination, data) => {
      // XX: override Yo's standard template method to use Handlebars templates
      const template = Handlebars.compile(this.read(source));
      const content = template(_.extend({}, this, data || {}));
      this.write(destination, content);
    };
  },

  _fileExists(fullFilePath) {
    try {
      fs.statSync(fullFilePath);
      return true;
    } catch (e) {
      return false;
    }
  },

  _readFile(fullFilePath) {
    return fs.readFileSync(fullFilePath).toString();
  },

  _dropHBSExtension(fileName) {
    const parts = fileName.split('.hbs');
    return parts.length === 2 ? parts[0] : fileName;
  },

  dummyMethod() {
    // XX: keep this here so tests can run against base generator
  }
});
