const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env = {}) => {
  const NODE_ENV = env.NODE_ENV || 'development';
  const SUBDOMAIN = NODE_ENV === 'production' ? env.SUBDOMAIN || '' : '';
  const CUSTOM_AUTH_DOMAIN = NODE_ENV === 'production' && env.DOMAIN
    ? `${env.SUBDOMAIN ? `${env.SUBDOMAIN}.` : ''}${env.DOMAIN}` : '';
  return ({
    entry: path.join(__dirname, 'src/App.tsx'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
    },
    mode: NODE_ENV,
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 7000,
      hot: true,
      historyApiFallback: true,
    },
    devtool: 'inline-cheap-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
      chunkIds: 'deterministic',
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            maxSize: 240000,
            chunks: 'all',
          },
          common: {
            test: /[\\/]src[\\/]/,
            maxSize: 240000,
            chunks: 'all',
          },
        },
      },
    },
    performance: {
      hints: NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 500000,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React Typescript App',
        template: 'index.html',
        favicon: path.join(__dirname, 'favicon.png'),
      }),
      new webpack.EnvironmentPlugin({
        SUBDOMAIN,
        CUSTOM_AUTH_DOMAIN,
        DEBUG_TOKEN: NODE_ENV === 'development',
      }),
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [
          { from: '.htaccess', to: '' },
        ],
      }),
    ],
  });
};
