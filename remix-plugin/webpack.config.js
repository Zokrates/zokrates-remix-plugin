var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.tsx',
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: "/node_modules/",
                loader: "ts-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
        })
    ]
}