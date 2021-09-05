const path = require('path');
const webpack = require('webpack');
const ConfigWebpackPlugin = require('config-webpack');

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV || 'development',

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ],
  },

  resolve: { extensions: ['', '.ts', '.tsx', '.js', '.jsx'] },

  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: 3000,
    publicPath: 'http://localhost:3000/dist',
    hotOnly: true,
    historyApiFallback: {
      index: 'index.html',
    },
  },

  plugins: [new webpack.HotModuleReplacementPlugin(), new ConfigWebpackPlugin()],
};
