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
  const appDirectory = 'app';
  const newSelectorName = 'new';

  describe('simple container', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          addReducer: false
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('sets up all container jazz', () => {
      assert.file([
        'index.js',
        'test.js'
      ].map(f => `${appDirectory}/containers/${containerName}/${f}`));

      assert.noFile([
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ].map(f => `${appDirectory}/containers/${containerName}/${f}`));
    });

    it('exposes component wrapped into connect', () => {
      assert.fileContent(`${appDirectory}/containers/${containerName}/index.js`,
        `export default connect(mapStateToProps, mapDispatchToProps)(${containerName});`);
    });
  });

  describe('container with new selector', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
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
      const containerFile = `${appDirectory}/containers/${containerName}/index.js`;
      assert.fileContent(containerFile,
        `import { ${newSelectorName}Selector } from '../selectors/${newSelectorName}';`
      );
      assert.fileContent(containerFile,
        `export default connect(createSelector(\n  ${newSelectorName}Selector(),`
      );
    });
  });

  describe('container with existing selector', () => {
    const selectorName = 'existingSelector';

    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          containerSelectorName: selectorName,
          selectorName
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('references selector in the container file', () => {
      const containerFile = `${appDirectory}/containers/${containerName}/index.js`;
      assert.fileContent(containerFile,
        `import { ${selectorName}Selector } from '../selectors/${selectorName}';`
      );
      assert.fileContent(containerFile,
        `export default connect(createSelector(\n  ${selectorName}Selector(),`
      );
    });
  });
});
