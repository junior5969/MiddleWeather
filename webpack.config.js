const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: { filename: 'img/[name][ext]' },
      },
    ],
  },
  resolve: { extensions: ['.ts', '.js'] },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/MiddleWeather/',  // importante per webpack-dev-server
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html', favicon: './img/favicon.ico', publicPath: '/MiddleWeather/', }),
    new CopyWebpackPlugin({ patterns: [{ from: 'img', to: 'img' }] }),
  ],
devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    port: 3000,
    open: true,
    proxy: { '/api': 'http://localhost:5000' }, // in locale chiama il backend
  },
};
