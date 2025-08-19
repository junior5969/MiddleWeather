const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: [/node_modules/, /src\/server/], },
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
    publicPath: '/', // Importante per SPA e routing
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './img/favicon.ico',
      publicPath: '/', // Assicura che tutti i link siano relativi alla root
      minify: true,    // Minifica HTML per produzione
    }),
    new CopyWebpackPlugin({ patterns: [{ from: 'img', to: 'img' }] }),
  ],
  devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    port: 3000,
    open: true,
    historyApiFallback: true, // IMPORTANTISSIMO per SPA su devServer
    proxy: { '/api': 'http://localhost:5000' }, // backend locale
  },
};
