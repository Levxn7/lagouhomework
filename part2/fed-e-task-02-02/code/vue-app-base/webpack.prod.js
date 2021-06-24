const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");


//生产环境的配置
module.exports = merge(common, {
  mode: "production",
  devtool: "nosources-source-map",   //sourceMap

  output: {
    filename: "js/[name].[hash:8].js", //8位hash值
    publicPath: "./"
  },
  optimization: {
    splitChunks: {
      chunks: "all" // 自动提取所有公共模块到单独 bundle
    },
    minimize: true,
    minimizer: [
      //css压缩
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { remove: true } //移除注释
        }
      }),
      // 更多功能在官网 https://webpack.docschina.org/plugins/terser-webpack-plugin/
      new TerserWebpackPlugin({
        parallel: true, //开启多线程来提高构建速度
        terserOptions: {
          warnings: false, //不展示warning
          compress: {
            unused: true, //去除未使用的
            drop_debugger: true, //移除debugger
            drop_console: true //去除console
          },
          output: {
            comments: false //去除注释
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 将样式通过 style 标签注入
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      minify: {//压缩
        removeComments: true, //去注释
        collapseWhitespace: true, //去空格
        removeAttributeQuotes: true //去属性引用
      }
    }),
    new DefinePlugin({
      BASE_URL: '"/public/"'
    }),
    new CleanWebpackPlugin(),//清理
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
    })
  ]
});