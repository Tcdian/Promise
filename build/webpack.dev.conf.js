const path = require("path");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const webpack = require("webpack");

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  output: {
    filename: "js/[name].[hash:16].js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              transpileOnly: true,
              useCache: true,
              cacheDirectory: path.resolve(__dirname, "../.cache")
            }
          }
        ]
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    port: "8524",
    contentBase: path.join(__dirname, "../public"),
    compress: true,
    historyApiFallback: true,
    hot: true,
    noInfo: true,
    open: true,
    proxy: {}
  }
});
