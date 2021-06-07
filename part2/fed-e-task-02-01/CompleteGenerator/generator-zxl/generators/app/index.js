// 1. 最基本的yeoman脚手架
// const Generator = require('yeoman-generator')

// module.exports = class extends Generator {
//   writing () {
//     this.fs.write(
//       this.destinationPath('test1.txt'),
//       Math.random().toString()
//     )
//   }
// }


// 2. 使用模版写入文件
// const Generator = require('yeoman-generator')

// module.exports = class extends Generator {
//   writing () {
//     const tmpl = this.templatePath('test2.txt')
//     const output = this.destinationPath('test2.txt')
//     const context = { content: 'This is test2', success: false }

//     this.fs.copyTpl(tmpl, output, context)
//   }
// }


//3.使用prompting方法接受用户输入数据
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