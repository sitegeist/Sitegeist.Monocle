import webpack from "webpack";
import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const configuration: webpack.Configuration = {
    entry: {
        App: './Resources/Private/JavaScript/index.tsx'
    },

    output: {
        filename: 'JavaScript/[name].js',
        path: path.resolve('./Resources/Public/')
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader'
				}
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                localIdentContext: __dirname
                            },
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'Resources/Private/JavaScript')
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({filename: './Styles/[name].css'})
    ],
};

export default configuration;
