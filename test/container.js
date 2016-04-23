/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

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
          appDirectory,
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
          appDirectory,
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

  describe('container with reducer', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/container'))
        .withPrompts({
          containerName,
          appDirectory,
          addReducer: true
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('creates standard container files + reducers, actions and constants', () => {
      assert.file([
        'index.js',
        'test.js',
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ].map(f => `${appDirectory}/containers/${containerName}/${f}`));
    });
  });
});
