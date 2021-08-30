import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : 'nosources-source-map',
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
      '@ns/apollo': path.resolve(__dirname, 'src/apollo'),
      '@ns/components': path.resolve(__dirname, 'src/components'),
      '@ns/containers': path.resolve(__dirname, 'src/containers'),
      '@ns/redux': path.resolve(__dirname, 'src/redux'),
      '@ns/support': path.resolve(__dirname, 'src/support'),
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/icons/favicon.ico',
          to: './',
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: ['@babel/preset-env'],
          },
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
    minimize: process.env.NODE_ENV === 'production',
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