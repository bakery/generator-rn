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
  }
});