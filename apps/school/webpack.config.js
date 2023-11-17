const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = function (options) {
  return {
    ...options,
    entry: {
      'apps/school/main': __dirname + '/main/index.ts',
      'apps/school': __dirname + '/src/main.ts',
    },
    // entry: __dirname + '/index.ts',
    output: {
      libraryTarget: 'commonjs2',
      filename: (chunkData) => {
        // Set the output filename based on entry name
        if (chunkData.chunk.name === 'apps/school') {
          return '[name]/main.js';
        }
        return '[name]/index.js';
      },
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['../../node_modules'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: `${__dirname}/tsconfig.app.json`,
        }),
      ],
    },
  };
};
