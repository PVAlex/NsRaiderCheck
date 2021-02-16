const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: '/src/appEntry.jsx',
  },
  output: {
    path: path.resolve('../src/main/resources/static'),
    filename: 'js/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@ns/apollo': path.resolve(__dirname, 'src/apollo/index.js'),
      '@ns/components': path.resolve(__dirname, 'src/components/index.js'),
      '@ns/containers': path.resolve(__dirname, 'src/containers/index.js'),
      '@ns/redux': path.resolve(__dirname, 'src/redux/index.js'),
      '@ns/support': path.resolve(__dirname, 'src/support/index.js'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      redux: require.resolve('redux'),
    },
    mainFiles: ['index'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new HtmlWebpackPlugin({
      filename: '../templates/index.html',
      hash: true,
      template: '/src/template/index.html',
      publicPath: '/',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer',
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              context: 'fonts',
              outputPath: 'fonts/',
              publicPath: '/fonts',
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              context: 'files',
              outputPath: 'files/',
              publicPath: '/files',
            }
            ,
          },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  optimization: {
    // removeEmptyChunks: true,
    // splitChunks: {
    //     chunks: 'all',
    // },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: () => false,
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
