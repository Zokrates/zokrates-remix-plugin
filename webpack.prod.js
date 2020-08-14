const merge = require('webpack-merge');
let [appConfig, workerConfig] = require("./webpack.common.js");

appConfig = merge(appConfig, {
    mode: 'production',
});

workerConfig = merge(workerConfig, {
    mode: 'production'
});

module.exports = [appConfig, workerConfig];