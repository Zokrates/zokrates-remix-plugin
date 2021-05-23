const merge = require('webpack-merge');
let [appConfig, workerConfig] = require("./webpack.common.js");

appConfig = merge(appConfig, {
    mode: 'production',
    output: {
        publicPath: "/zokrates-remix-plugin/"
    }
});

workerConfig = merge(workerConfig, {
    mode: 'production',
    output: {
        publicPath: "/zokrates-remix-plugin/"
    }
});

module.exports = [appConfig, workerConfig];