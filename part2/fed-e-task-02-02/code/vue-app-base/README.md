# vue-app-base

1. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
2. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
3. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
4. 尽可能的使用上所有你了解到的功能和特性

#### 安装及初步打包
> yarn add webpack webpack-cli \--dev
> yarn webpack --version 打印出版本号为安装成功

webpack支持0配置, 一般来说会将 src/index.js 作为打包入口, 将结果存入 dist/main.js 中, 但是也可以自己在配置文件中设置
> entry: './src/main.js',

yarn webpack --config webpack.common.js 是打包命令, 这时如果运行打包命令会报错,因为我们还没有安装loader

webpack内部默认只会打包js文件, 如果打包css等文件需要安装loader来操作, webpack可将任何资源模块导入js一起打包, 在rules中引用
> npm i less less-loader style-loader css-loader \--save-dev //要安装less才可以使用less-loader
> yarn add vue-loader \--dev //处理vue文件
> yarn add babel-loader @vue/cli-plugin-babel/preset \--dev 
> yarn add file-loader \--dev //文件操作
> yarn add url-loader \--dev //小文件可以使用 Data URLs，可以减少请求次数, 大文件尽量单独提取存放, 可以提高加载速度
> yarn add html-webpack-plugin \--dev
> yarn add webpack-dev-server \--dev //起服务

安装完成后再webpack.common.js中写入内容, 使用loader的各种处理
导入 VueLoaderPlugin 模块并在plugin中调用

此时再打包会有报错, 我们来排错:
- 报错"Module Error (from ./node_modules/less-loader/dist/cjs.js):"
得知yarn add less-loader \--dev自动安装版本为10.0.0, 太高了不支持,改为以下方法安装7.3.0版本
> npm install less-loader@7.3.0 \--save-dev

- 报错"[vue-loader] vue-template-compiler must be installed as a peer dependency, or a compatible compiler implementation must be passed via options."
安装vue-template-compiler模块来解决
> npm install vue-template-compiler \--save-dev

再进行打包就可以成功输出dist目录了!

运行webpack-dev-server报错"Error: Cannot find module 'webpack-cli/bin/config-yargs'"
得知是webpack-cli的新版本对webpack-dev-server版本的不兼容, 之后降低webpack-cli的版本为 "^3.3.12", npm i webpack-cli@3.3.12 -D就OK了


#### 编写dev和prod
导入common模块
> yarn add webpack-merge --dev  //merge common.js 的配置到dev或prod

prod
提取css到单个文件, 不过, 超过150kb才会考虑单独提取
> yarn add mini-css-extract-plugin \--dev
> yarn add optimize-css-assets-webpack-plugin \--dev

清理上次打包文件
> yarn add clean-webpack-plugin --dev

> yarn add terser-webpack-plugin --dev