const path = require('path');

module.exports = {
  entry: './src/index',
  output: {
    filename: 'react-tween.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ReactTween',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        loaders: ['babel', 'eslint'],
      },
    ],
  },
};
