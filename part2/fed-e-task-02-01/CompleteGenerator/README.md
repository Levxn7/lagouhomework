
**1.最基本的yeoman脚手架**
名称必须是generator-<name>格式
```js
mkdir generator-zxl
cd generator-zxl
yarn init //创建package.json
yarn add yeoman-generator // 这个模块提供了生成器的一个基类, 这个基类当中提供了一些工具函数 让我们在使用时更加便捷
```
使用vscode打开项目, 创建generators/app/index.js, 此文件作为Generator的核心入口, 需要导出一个继承自Yeoman Generator的类型
Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法, 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能, 例如文件写入
```js
const Generator = require('yeoman-generator')
module.exports = class extends Generator {
  writing () {
    this.fs.write(
      this.destinationPath('zxl.txt'),
      Math.random().toString()
    )
  }
}
```
yarn link发布
```js
localhost:generator-zxl zxl$ yarn link
yarn link v1.22.10
success Registered "generator-zxl".
info You can now run `yarn link "generator-zxl"` in the projects where you want to use this package and it will be used instead.
✨  Done in 0.04s.
```


新建一个项目
```js
mkdir test-pro
cd test-pro
yo sample
```
```js
localhost:CompleteGenerator zxl$ yo zxl
   create zxl.txt
```
这就创建好了, 可以看到我们使用yo zxl为新文件夹创建了一个txt文件并写入了一个随机数, 这就是最基本的yeoman的开发过程,
下面我们再给他加上一点东西

**2.使用模版写入文件**
相对于手动创建每一个文件, 模板的方式大大提高了效率
在app文件夹下新建templates/test2.txt
```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  writing () {
    const tmpl = this.templatePath('test2.txt')
    const output = this.destinationPath('test2.txt')
    const context = { content: 'Hello zce~', success: false }

    this.fs.copyTpl(tmpl, output, context)
  }
}
```
在test2.txt中使用<%= content %>模式来替换关键字, yo zxl的结果生成test2.txt 其中内容也被替换了context中的内容


**3.使用prompting方法接受用户输入数据**
下面我们使用prompting方法接受用户输入数据, 然后把获取的结果传入context
```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    return this.prompt([
      {
        type: 'input', //用户输入方式
        name: 'content',  //对应返回值的键
        message: 'input content please', //给用户的提示
        default: this.appname // appname 为项目生成目录名称
      }
    ])
    .then(answers => {
      this.answers = answers
    })
  }
  writing () {
    const tmpl = this.templatePath('test2.txt')
    const output = this.destinationPath('test3.txt')
    const context = this.answers // 这里为用户输入结果
    this.fs.copyTpl(tmpl, output, context)
  }
}
```
yo zxl 后生成test3.txt
