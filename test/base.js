/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;

describe('base generator', () => {
  let _generator = null;

  before(done => {
    helpers.run(path.join(__dirname, '../generators/container'))
      .on('ready', function (generator) {
        _generator = generator;
      }).on('end', done);
  });

  it('base generator is defined', () => {
    expect(_generator).to.be.ok;
  });

  it('base generator exposes templateHelpers', () => {
    expect(_generator.helpers).to.be.ok;
    expect(_generator.helpers.lodash).to.be.ok;
  });
});