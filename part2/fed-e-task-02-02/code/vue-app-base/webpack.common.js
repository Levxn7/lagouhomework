const path = require('path')
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'none',
    entry: './src/main.js', //设置输入
    output: { //设置输出
        path: path.join(__dirname, 'dist') //必须是绝对路径
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
            },{
                test: /\.less$/,
                use: [
                    'style-loader', //会从后往前执行
                    'css-loader',
                    'less-loader'
                    ]
            },{
                test: /\.vue$/, //解析vue文件
                use: ["vue-loader"]
            },{
                test: /\.js$/,
                exclude: /node_modules/,//刨除node_modules中的js代码
                use: "babel-loader",
                // options: {
                //   presets: ['@babel/preset-env']
                // }
            },{ 
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                loader: "url-loader",//限制最大为10k
                options: {
                  limit: 10 * 1024,
                  esModule: false//一定要加这个 不然src会显示object module
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
          template: "./public/index.html"
        }),
    ]
}