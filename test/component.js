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
  const boilerplate = 'Vanila';
  const appDirectory = 'app';
  const componentModule = `${appDirectory}/components/${componentName}/index.js`;
  const stylesheetModule = `${appDirectory}/components/${componentName}/styles.js`;

  before(done => {
    helpers.run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        componentName,
        boilerplate
      }).on('ready', function (generator) {
      }).on('end', done);
  });

  it('sets up all component jazz', () => {
    assert.file([
      'index.js',
      'test.js',
      'styles.js'
    ].map(f => `${appDirectory}/components/${componentName}/${f}`));
  });

  it('exports component as-is without container wrapping', () => {
    assert.fileContent(componentModule, `export default ${componentName}`);
  });

  it('generates a stylesheet', () => {
    assert.file(stylesheetModule);
  });

  it('includes reference to the stylesheet', () => {
    assert.fileContent(componentModule, `import styles from './styles';`);
  });
});
