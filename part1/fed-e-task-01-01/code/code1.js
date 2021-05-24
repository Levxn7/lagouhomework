/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

let t = function (str) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(str) 
    }, 10)  
  })
}


let x =  t('hello').then(res => {
    return res
  }).then(res => {
     return t('lagou').then(res1 => {
      return res + ' ' + res1
    })
  }).then(res => {
    t('I ♥ U').then(res1 => {
      console.log(res + ' ' + res1);
    })
  })


