const merge = require('webpack-merge');
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        port: '8080',
        disableHostCheck: true,
        https: true,
        hot: true,
    },
});