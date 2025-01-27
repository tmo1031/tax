const path = require('path');

module.exports = {
  mode: 'development', // 'development' または 'production' または 'none' を指定
  entry: './src/index.ts', // エントリーポイントを指定
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'docs/js'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
