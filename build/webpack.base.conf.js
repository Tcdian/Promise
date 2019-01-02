const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "../src/index.ts")
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ],
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "@components": path.resolve(__dirname, "../src/components")
    }
  }
};
