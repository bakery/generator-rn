import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

describe('generator-rn:app', () => {
  before(done => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .on('end', done);
  });

  it('creates files', () => {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
