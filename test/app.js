/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;

describe('generator-rn:app', () => {
  let _checkIfRNIsInstalledStub = null;

  before(done => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .on('ready', function (generator) {
        _checkIfRNIsInstalledStub =
          sinon.stub(generator, '_checkIfRNIsInstalled').returns(true);
      })
      .on('end', done);
  });

  after(() => {
    _checkIfRNIsInstalledStub && _checkIfRNIsInstalledStub.restore();
  });

  it('creates files', () => {
    assert.file([
      'dummyfile.txt'
    ]);
  });

  it('checks if react-native is installed', () => {
    expect(_checkIfRNIsInstalledStub.calledOnce).to.be.ok;
  });
});
