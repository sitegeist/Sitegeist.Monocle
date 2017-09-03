const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    entry: {
        App: [
            'regenerator-runtime/runtime',
            'babel-polyfill',
            './Resources/Private/JavaScript/index.js'
        ]
    },

    output: {
        filename: 'JavaScript/[name].js',
        path: path.resolve('./Resources/Public/')
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'babel-loader'}
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {limit: 100000}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        {loader: 'postcss-loader'}
                    ]
                })
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'Resources/Private/JavaScript')
        ]
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin({filename: './Styles/[name].css', allChunks: true}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        })
    ].concat(
        process.env.NODE_ENV === 'production' ? [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ] : []
    )
};
