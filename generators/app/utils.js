import fs from 'fs';
import esprima from 'esprima';
import escodegen from 'escodegen';

const escodegenOptions = {
  format: {
    indent: {
      style: '  '
    }
  }
};

//   const selectorsModule = esprima.parse('');
//   selectorsModule.body.push(
//     {
//       type: 'ExportDefaultDeclaration',
//       declaration: {
//         type: 'ArrayExpression',
//         elements: [
//           {
//             type: 'Identifier',
//             name: 'bodySelector'
//           },
//           {
//             type: 'Identifier',
//             name: 'anotherSelector'
//           }
//         ]
//       }
//     }
//   );

//   this.write(`${this.appDirectory}/${this.selectorsDirectory}/index.js`,
//     escodegen.generate(selectorsModule, escodegenOptions)
//   );
// }

module.exports = {
  readReducersFileContent(generator) {
    if (!generator) {
      throw new Error('You must pass a generator instance');
    }

    const reducersFile = generator.destinationPath(
      `${generator.appDirectory}/reducers.js`);

    try {
      fs.statSync(reducersFile);
      return fs.readFileSync(reducersFile).toString();
    } catch (e) {
      return fs.readFileSync('./templates/app/reducers.js').toString();
    }
  },

  registerReducer(reducerName, generator) {
    // modify app/reducers.js file to include new reducer
    const reducersFileContent = this.readReducersFileContent(generator);
    console.error('@@ reducers are', reducersFileContent);

    const reducersModule = esprima.parse(reducersFileContent);
    console.error('reducers module is', reducersModule);

    console.error(
      escodegen.generate(reducersModule, escodegenOptions)
    );
  }
};
