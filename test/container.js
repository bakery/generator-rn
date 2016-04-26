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
  const containerSelectorName = 'New Selector';
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
  });

  describe('container with new selector', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          containerSelectorName,
          selectorName: newSelectorName
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('creates a new selector file', () => {
      assert.file([
        `${appDirectory}/selectors/${newSelectorName}.js`
      ]);
    });
  });
});
