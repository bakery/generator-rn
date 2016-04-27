/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs-extra';

const expect = chai.expect;

describe('generator-rn:app', () => {
  let _checkIfRNIsInstalledStub = null;
  let _initRNSpy = null;
  const applicationName = 'MyReactApp';
  const applicationFiles = [
    'app/sagas/index.js',
    'app/selectors/appSelector.js',
    'app/reducers.js',
    'app/setup.js',
    'app/store.js',
    '.eslintrc',
    'index.ios.js',
    'index.android.js',
    'package.json'
  ];

  describe('simple generator', () => {
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

    it('sets up all the app files', () => {
      assert.file(applicationFiles);
    });
  });

  describe('running generator in a non-empty directory', () => {
    let _generator;

    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          fs.copySync(
            path.join(__dirname, './fixtures/random-file.txt'),
            path.join(dir, 'random-file.txt')
          );
        })
        .withPrompts({
          name: applicationName
        })
        .on('ready', function (generator) {
          _generator = generator;
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

    it('sets things up in a newly created directory', () => {
      expect(_generator.destinationPath('.').indexOf(applicationName)).to.be.ok;
      assert.file(applicationFiles);
    });
  });
});
