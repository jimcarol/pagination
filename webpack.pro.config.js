const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: {
    bundle: __dirname + "/app/index.js",
    'wj': __dirname + "/app/wj_funny.js"
  },
  output: {
    path: __dirname+ "/dist",
    filename: "[name].js"
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
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: "../images/[name].[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath('[name].css').replace('bundle', 'styles');
      },
      ignoreOrder: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      parallel: {
        cache: true,
        workers: 2
      }
    }),
  ]
}