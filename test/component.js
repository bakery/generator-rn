/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import yeoman from 'yeoman-generator';

const expect = chai.expect;

describe('generator-rn:component', () => {
  const componentName = 'MyComponent';
  const appDirectory = 'app';

  before(done => {
    helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        componentName,
        appDirectory
      }).on('ready', function (generator) {
      }).on('end', done);
  });

  it('sets up all component jazz', () => {
    assert.file([
      'index.js',
      'test.js'
    ].map(f => `${appDirectory}/components/${componentName}/${f}`));
  });

  it('exports component as-is without container wrapping', () => {
    assert.fileContent(`${appDirectory}/components/${componentName}/index.js`,
      `export default ${componentName}`);
  });
});
