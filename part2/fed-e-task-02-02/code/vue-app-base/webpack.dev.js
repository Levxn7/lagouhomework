const { DefinePlugin } = require('webpack')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: 'development',
  devtool: "eval-cheap-module-source-map", //sourcemap
  devServer: {
    hot: true, //热更新
    contentBase: 'public'
  },
  module: {
    rules: [ //加载规则
      // {
      //     test: /\.(vue|js)$/,
      //     loader: "eslint-loader",
      //     exclude: /node_modules/,
      //     // 预处理
      //     enforce: "pre"
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader', //会从后往前执行
          'css-loader'
        ]
      }, {
        test: /\.less$/,
        use: [
          'style-loader', //会从后往前执行
          'css-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new DefinePlugin({
      BASE_URL: '"./"'  //index.html中使用
    })
  ]
})
