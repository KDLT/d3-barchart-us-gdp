const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const htmlwp = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const htmlWebpackPlugin = new htmlwp({
  template: "./src/index.html",
  filename: "./index.html" // (output directory) no need to put dist
});

const extractPlugin = new ExtractTextPlugin({
   filename: "main.css"
});

module.exports = {
  entry: "./src/app/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "docs")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    new UglifyJsPlugin(),
    extractPlugin
  ]
};
