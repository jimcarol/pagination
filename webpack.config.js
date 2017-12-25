const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: __dirname + "/app/index.js",
  output: {
    path: __dirname+ "/dist",
    filename: "bundle.js"
  },
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./",
    publicPath: "/dist/",
    inline: true,
    port: 3002,
    historyApiFallback: true,
    open: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["env", "react"]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: { 
                modules: true,
                localIdentName: "[name]__[local]--[hash:base64:5]"
              }
            },
            "sass-loader"
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({filename: "styles.css", ignoreOrder: true})
  ]
}