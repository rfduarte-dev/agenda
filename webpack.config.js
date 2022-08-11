const path = require('path') //CommonJS
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //MiniCss

module.exports = {
  mode: 'production',
  entry: './frontend/main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  module: {
    rules: [
      {
        exclude: /nome_modules/,
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'source-map'
}
