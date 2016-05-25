/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import yeoman from 'yeoman-generator';

const expect = chai.expect;

describe('generator-rn:container', () => {
  const containerName = 'MyContainer';
  const boilerplate = 'Vanila';
  const appDirectory = 'app';
  const newSelectorName = 'newData';
  const containerModule = `${appDirectory}/components/${containerName}/index.js`;
  const stylesheetModule = `${appDirectory}/components/${containerName}/styles.js`;

  describe('simple container', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          boilerplateName: boilerplate,
          addReducer: false
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('sets up all container jazz', () => {
      assert.file([
        'index.js',
        'test.js'
      ].map(f => `${appDirectory}/components/${containerName}/${f}`));

      assert.noFile([
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ].map(f => `${appDirectory}/components/${containerName}/${f}`));
    });

    it('exposes component wrapped into connect', () => {
      assert.fileContent(containerModule,
        `export default connect(mapStateToProps, mapDispatchToProps)(${containerName});`);
    });

    it('generates a stylesheet', () => {
      assert.file(stylesheetModule);
    });

    it('includes reference to the stylesheet', () => {
      assert.fileContent(containerModule, `import styles from './styles';`);
    });
  });

  describe('container with new selector', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          boilerplateName: boilerplate,
          addReducer: false,
          containerSelectorName: 'New Selector',
          selectorName: newSelectorName
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('creates a new selector file', () => {
      assert.file([
        `${appDirectory}/selectors/${newSelectorName}.js`
      ]);
    });

    it('references selector in the container file', () => {
      const containerFile = `${appDirectory}/components/${containerName}/index.js`;
      assert.fileContent(containerFile,
        `import selectNewData from '../../selectors/${newSelectorName}';`
      );
      assert.fileContent(containerFile,
        `export default connect(createSelector(\n  selectNewData,`
      );
    });
  });

  describe('container with existing selector', () => {
    const selectorName = 'existingData';

    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          boilerplateName: boilerplate,
          addReducer: false,
          containerSelectorName: selectorName,
          selectorName
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('references selector in the container file', () => {
      const containerFile = `${appDirectory}/components/${containerName}/index.js`;
      assert.fileContent(containerFile,
        `import selectExistingData from '../../selectors/${selectorName}';`
      );
      assert.fileContent(containerFile,
        `export default connect(createSelector(\n  selectExistingData,`
      );
    });
  });

  describe('container with a reducer', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withOptions({
          boilerplateName: boilerplate
        })
        .withPrompts({
          containerName,
          addReducer: true
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('generates reducer related files', () => {
      assert.file([
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ].map(f => `${appDirectory}/components/${containerName}/${f}`));
    });
  });
});
