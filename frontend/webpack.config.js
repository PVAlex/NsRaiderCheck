let path = require('path');
let webpack = require('webpack');

let ExtractTextPlugin = require ('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        "babel-polyfill",
        path.join(__dirname) + '/src/index.jsx'
    ],
    output: {
        path: path.resolve("../src/main/resources/static/generated"),
        filename: 'appBundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     warnings: false,
        //     mangle: true
        // }),
        new webpack.LoaderOptionsPlugin({
            debug: true}),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),
        new ExtractTextPlugin('styles.css'),

    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            // {
            //   test: /\.jsx?$/,
            //   exclude: /node_modules/,
            //   loader: ['babel-loader'],
            //   query: {
            //       presets: ['env', 'stage-0', 'react']
            //   }
            // },
            {
                test: /\.(eot|svg|ttf|woff2?|otf)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts/',
                },
            },
            {
                test: /\.(sa|s?c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader',
                }),
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        bypassOnDebug: true, // webpack@1.x
                        disable: true, // webpack@2.x and newer
                        outputPath: 'files/'
                    },
                }
                ],
            }
        ]
    },
    devServer: {
        noInfo: false,
        quiet: false,
        lazy: false,
        watchOptions: {
            poll: true
        }
    }
}