/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fsExtra from 'fs-extra';
import fs from 'fs';
import _ from 'lodash';

const expect = chai.expect;

describe('generator-rn:app', () => {
  let _generator;
  let _checkIfRNIsInstalledStub = null;
  let _initRNSpy = null;
  let _abortSetupStub = null;
  const applicationName = 'MyReactApp';
  const applicationFiles = [
    'app/reducers.js',
    'app/setup.js',
    'app/store.js',
    'app/components/App/index.js',
    'app/components/App/styles.js',
    '.eslintrc',
    'index.ios.js',
    'index.android.js',
    'package.json'
  ];

  const _stubThings = generator => {
    _generator = generator;
    _checkIfRNIsInstalledStub = sinon.stub(generator, '_checkIfRNIsInstalled').returns(true);
    _initRNSpy = sinon.stub(generator, '_initRN').returns(true);
    _abortSetupStub = sinon.stub(generator, '_abortSetup').returns(true);
  };

  const _unstubThings = () => {
    _checkIfRNIsInstalledStub && _checkIfRNIsInstalledStub.restore();
    _initRNSpy && _initRNSpy.restore();
    _abortSetupStub && _abortSetupStub.restore();
  };

  describe('simple generator', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

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
    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          fsExtra.copySync(
            path.join(__dirname, './fixtures/random-file.txt'),
            path.join(dir, 'random-file.txt')
          );
        })
        .withPrompts({
          name: applicationName
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('sets things up in a newly created directory', () => {
      expect(_generator.destinationPath('.').indexOf(applicationName) !== -1).to.be.ok;
      assert.file(applicationFiles);
    });
  });

  describe('running generator in a non-empty directory with something that looks like a RN app', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          // XX: make it look like a directory with some RN artifacts
          fs.mkdirSync(path.join(dir, 'android'));
          fs.mkdirSync(path.join(dir, 'ios'));
          fs.writeFileSync(path.join(dir, 'index.ios.js'), '00000000');
          fs.writeFileSync(path.join(dir, 'index.android.js'), '00000000');
        })
        .withPrompts({
          name: applicationName
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('bails on app generation', () => {
      expect(_abortSetupStub.calledOnce).to.be.ok;
    });
  });

  describe('running generator in a non-empty directory with --baker flag', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          fsExtra.copySync(
            path.join(__dirname, './fixtures/random-file.txt'),
            path.join(dir, 'random-file.txt')
          );
        })
        .withOptions({baker: 'baker'})
        .withPrompts({
          name: applicationName
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('sets up all the app files except for package.json', () => {
      assert.file(_.filter(applicationFiles, f => f !== 'package.json'));
      assert.noFile('package.json');
    });

    it('does not create a new directory', () => {
      expect(_generator.destinationPath('.').indexOf(applicationName) === -1).to.be.ok;
    });
  });
});
