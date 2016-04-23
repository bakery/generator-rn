/* globals ls: false */

import 'shelljs/global';
import path from 'path';
import fs from 'fs';

module.exports = {
  getExistingSelectors(generator) {
    if (!generator) {
      throw new Error('You must pass a generator instance');
    }

    const selectorsDirectoryPath =
      generator.destinationPath(`${generator.appDirectory}/selectors`);

    try {
      fs.statSync(selectorsDirectoryPath);
    } catch (e) {
      return [];
    }

    return ls(`${selectorsDirectoryPath}/*.js`)
      .map(file => path.basename(file).split('.js')[0]);
  }
};
