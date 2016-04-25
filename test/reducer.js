/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mkdirp from 'mkdirp';

const expect = chai.expect;

describe('generator-rn:reducer', () => {
  const appDirectory = 'app';
  const container = 'MyNewContainer';

  before(done => {
    helpers.run(path.join(__dirname, '../generators/reducer'))
      // .inTmpDir(function (dir) {
      //   var done = this.async();
      //   mkdirp(path.resolve(dir, `${appDirectory}/containers/${container}`), done);
      // })
      .withOptions({
        appDirectory,
        container
      }).withPrompts({
        appDirectory,
        container
      })
      .on('ready', function (generator) {
      }).on('end', done);
  });

  it('creates reducer files', () => {
    assert.file([
      'reducer.js',
      'reducer.test.js',
      'actions.js',
      'actions.test.js',
      'constants.js'
    ].map(f => `${appDirectory}/containers/${container}/${f}`));
  });

  it('updates root reducers file with new reducer info', () => {
    const reducersModulePath = `${appDirectory}/reducers.js`;
    assert.file(reducersModulePath);
    assert.fileContent(reducersModulePath,
      `import ${container}Reducer from './containers/${container}/reducer'`
    );
    assert.fileContent(reducersModulePath,
      `${container}: ${container}Reducer`
    );
  });
});
