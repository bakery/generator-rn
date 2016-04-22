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

  before(done => {
    helpers.run(path.join(__dirname, '../generators/container'))
      .withPrompts({
        containerName,
        appDirectory
      }).on('ready', function (generator) {
      }).on('end', done);
  });

  it('sets up all container jazz', () => {
    assert.file([
      'actions.js',
      'actions.test.js',
      'constants.js',
      'index.js',
      'reducer.js',
      'reducer.test.js',
      'selector.js',
      'test.js'
    ].map(f => `${appDirectory}/containers/${containerName}/${f}`));
  });
});
