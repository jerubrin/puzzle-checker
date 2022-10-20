const path = require('path')
const htmlWPPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const { SplitChunksPlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const FileLoader = require('file-loader')

const isDev = process.env.NODE_ENV === 'development'

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (!isDev) {
        config.minimizer = [
            new TerserPlugin()
        ],
        config.minimize = true
    }
}

const filename = ext => isDev ? `[name].${ext}` : `[name]_[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
        MiniCSSExtractPlugin.loader,
        {
            loader: "css-loader",
            options: { sourceMap: true }
        }
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

module.exports = {
    context: path.resolve(__dirname, ''),
    mode: 'development',
    entry: {
        main: './src/js/index.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, "build")
    },
    optimization: optimization(),
    devServer: {
        port: 8088,
        hot: isDev,
        historyApiFallback: true
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new htmlWPPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                // {
                //     from: path.resolve(__dirname, 'src/assets/sounds/*.mp3'),
                //     to: path.resolve(__dirname, 'build/assets/sounds'),
                //     noErrorOnMissing: true
                // },
                {
                    from: path.resolve(__dirname, 'src/img/favicon/favicon.ico'),
                    to: path.resolve(__dirname, 'build/assets')
                }
            ]
        }),
        new MiniCSSExtractPlugin({
            filename: filename('css'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },

            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif|ico)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'
            },
            // {
            //     test: /\.m?js&/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: "babel-loader",
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // },
        ]
    }
}