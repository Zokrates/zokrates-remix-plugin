const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appConfig = {
  entry: "./index.tsx",
  experiments: {
    syncWebAssembly: true,
  },
  ignoreWarnings: [(_warning) => true],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: "/node_modules/",
        loader: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".wasm"],
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ],
};

const workerConfig = {
  entry: "./src/worker.ts",
  target: "webworker",
  experiments: {
    syncWebAssembly: true,
  },
  ignoreWarnings: [(_warning) => true],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: "/node_modules/",
        loader: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".wasm"],
  },
  output: {
    filename: "worker.js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
  },
};

module.exports = [appConfig, workerConfig];
