const { DefinePlugin } = require('webpack')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devtool: "eval-cheap-module-source-map", //sourcemap
  devServer: {
    hot: true, //热更新
    contentBase: 'public'
  },
  plugins: [
    new DefinePlugin({
        BASE_URL: "/public/"  //index.html中使用
      })
  ]
})
