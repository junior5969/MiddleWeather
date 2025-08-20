import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
  mode: 'production',
  entry: './src/app.ts',   // il tuo file principale frontend
  target: 'web',           // compilazione per browser
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve('./dist/client'), // separiamo il client
    clean: true,
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',            // usa il tuo index.html root
      favicon: './img/favicon.ico',        // favicon se ce l’hai nella root /img
      minify: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'img', to: 'img' }], // copia la cartella img
    }),
  ],
  devServer: {
    static: './dist/client',
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:5000', // proxy verso il backend in locale
    },
  },
};