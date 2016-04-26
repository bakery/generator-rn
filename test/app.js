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
  let _initRNSpy = null;

  before(done => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .on('ready', function (generator) {
        _checkIfRNIsInstalledStub =
          sinon.stub(generator, '_checkIfRNIsInstalled').returns(true);
        _initRNSpy =
          sinon.stub(generator, '_initRN').returns(true);
      })
      .on('end', done);
  });

  after(() => {
    _checkIfRNIsInstalledStub && _checkIfRNIsInstalledStub.restore();
    _initRNSpy && _initRNSpy.restore();
  });

  it('checks if react-native is installed', () => {
    expect(_checkIfRNIsInstalledStub.calledOnce).to.be.ok;
  });

  it('runs RN setup script', () => {
    expect(_initRNSpy.calledOnce).to.be.ok;
  });

  it('creates package.json file', () => {
    assert.file([
      'package.json'
    ]);
  });

  it('creates index.ios.js and index.android.js files', () => {
    assert.file([
      'index.ios.js',
      'index.android.js'
    ]);
  });

  it('includes .eslintrc file', () => {
    assert.file([
      '.eslintrc'
    ]);
  });

  it('setups basic app structure in the app directory', () => {
    assert.file([
      'sagas/index.js',
      'selectors/appSelector.js',
      'reducers.js',
      'setup.js',
      'store.js'
    ].map(f => `app/${f}`));
  });
});
