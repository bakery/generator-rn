import yeoman from 'yeoman-generator';
import _ from 'lodash';
import s from 'underscore.string';
import changeCase from 'change-case';
import fs from 'fs';
import Handlebars from 'handlebars';
import esprima from 'esprima';
import escodegen from 'escodegen';

_.mixin(s.exports());

module.exports = yeoman.Base.extend({
  constructor() {
    yeoman.Base.apply(this, arguments);

    this.appDirectory = 'app';

    this.helpers = _.extend({}, changeCase);

    this.escodegenOptions = {
      format: {
        indent: {
          style: '  ',
          base: 0,
          adjustMultilineComment: false,
          preserveBlankLines: true
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
      parse: esprima.parse,
      comment: true,
      sourceMap: undefined,
      sourceMapRoot: null,
      sourceMapWithCode: false,
      file: undefined,
      // sourceContent: originalSource,
      directive: false,
      verbatim: undefined
    };

    this.esprimaOptions = {
      sourceType: 'module',
      comment: true,
      range: true,
      loc: true,
      tokens: true,
      raw: false
    };

    this.namingConventions = {
      // used for UI components and containers
      componentName: {
        regEx: /^[A-Z][0-9A-Z]*$/i,
        clean: name => {
          return this.helpers.pascal(name);
        }
      }
    };

    this.template = (source, destination, data) => {
      // XX: override Yo's standard template method to use Handlebars templates
      const template = Handlebars.compile(this.read(source));
      const content = template(_.extend({}, this, data || {}));
      this.write(destination, content);
    };

    this.parseJSSource = content => {
      let tree = esprima.parse(content, this.esprimaOptions);
      tree = escodegen.attachComments(tree, tree.comments, tree.tokens);
      return tree;
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
