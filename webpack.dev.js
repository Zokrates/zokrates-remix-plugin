const merge = require('webpack-merge');
let [appConfig, workerConfig] = require("./webpack.common.js");

appConfig = merge(appConfig, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        port: '10000',
        disableHostCheck: true,
        https: true,
        hot: true,
        host: 'localhost'
    },
});

workerConfig = merge(workerConfig, {
    mode: 'development'
});

module.exports = [appConfig, workerConfig];