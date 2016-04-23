/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;

describe('generator-rn:selector', () => {
  const selectorName = 'apple';
  const appDirectory = 'app';

  before(done => {
    helpers.run(path.join(__dirname, '../generators/selector'))
      .withPrompts({
        appDirectory,
        selectorName
      }).on('ready', function (generator) {
      }).on('end', done);
  });

  it('creates a selector file', () => {
    assert.file([
      `${appDirectory}/selectors/${selectorName}.js`
    ]);
  });
});
