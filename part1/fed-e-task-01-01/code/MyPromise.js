const { reject } = require("lodash")
const { resolve } = require("../../../../fed-e-012/prepare/01-01-study-materials/01-01-codes/01-01-03-01-my-promise/myPromise")

/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/
const Pending = 'pending'
const Resolve = 'fulFilled'
const Rejected = 'rejected'
class myPromise {
    //执行器
    constructor (ex){
        try {
            return ex(this.resolve, this.reject)
        } catch (e){
            this.reject(e)
        }
    }
    
    status = Pending
    //声明变量
    value = undefined
    reason = undefined
    scb = []
    fcb = []

    static resolve(value){
        if(value instanceof myPromise) return value
        return new myPromise(resolve => resolve(value))
    }

    resolve = value =>  {
        //如果是Pending状态再继续执行 改状态 赋值等操作
        if (this.status !== Pending) return
        this.status = Resolve
        this.value = value
        // this.scb && this.scb(this.value)
        //循环执行
        while (this.scb.length) this.scb.shift()()
    }
    reject = reason =>  {
        if (this.status !== Pending) return
        this.status = Rejected
        this.reason = reason
        // this.fcb && this.fcb(this.reason)
        while (this.fcb.length) this.fcb.shift()()
    }

    then(scb, fcb) {
        scb = scb ? scb : value => value
        fcb = fcb ? fcb : reason => { throw reason}
        let p2 = new myPromise((resolve, reject) => {
            //分三种状态判断
            if (this.status === Resolve) {
                //处理异步
                setTimeout(() => {
                    try {
                        resPro(scb(this.value), resolve, reject, p2)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            } else if (this.status === Rejected) {
                setTimeout(() => {
                    try {
                        resPro(fcb(this.reason), resolve, reject, p2)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            } else {
                this.scb.push(() => {
                    setTimeout(() => {
                        try {
                            resPro(scb(this.value), resolve, reject, p2)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
                this.fcb.push(() => {
                    setTimeout(() => {
                        try {
                            resPro(fcb(this.reason), resolve, reject, p2)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }
        })
        return p2

    }
    static all(arr) {
        let result = []
        let sum = 0
        return new myPromise((resolve, reject) => {
            function add (i, t) {
                result[i] = t
                sum++
                if (sum === arr.length) {
                    resolve(result) 
                }
            }
            for(let i = 0; i<arr.length; i++){
                let cur = arr[i]
                if (cur instanceof myPromise ) {
                    //promise
                    cur.then(res => add(i, res), rej => reject(rej))
                } else {
                    //普通值
                    add(i, cur)
                }
            }
        })
    }
    static race(arr) {
        let sum = 0
        return new myPromise((resolve, reject) => {
            function addresolve (t) {
                sum++
                if (sum === 1) {
                    resolve(t) 
                    return
                }
            }
            function addreject (t) {
                sum++
                if (sum === 1) {
                    reject(t) 
                    return
                }
            }
            for(let i = 0; i<arr.length; i++){
                let cur = arr[i]
                if (cur instanceof myPromise ) {
                    //promise
                    cur.then(res => addresolve(res), rej => addreject(rej))
                } else {
                    //普通值
                    addresolve(cur)
                }
            }
        })
    }
    catch(fcb) {
        return this.then(undefined, fcb)
    }
    finally(cb) {
        return this.then(res => {
            //等待cb执行完成
            return myPromise.resolve(cb()).then(() => res)
        },rej => {
            return myPromise.resolve(cb()).then(() => {throw rej})
        })
    }

}
function resPro(x, resolve, reject, p2) {
    //如果和本身一样就抛出错误
    if (p2 === x) {
        return reject(new TypeError('循环'))
    }
    //如果是promise就执行  如果不是就包一层
    if (x instanceof myPromise ) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }

}

let pro = new myPromise(function (resolve, reject) {
    resolve('resolve1')
    // reject('reject1')
    //   setTimeout(function () {
    //     resolve('p1')
    //   }, 1000)
    })


//测试
// function p2 () {
//     return new myPromise(function (resolve, reject) {
//         resolve('aaaa')
//         // resolve('成功');  
//     })
// }
  
// let p1 = pro.then(value => {
//     console.log(value)
//     return p1
//     // throw new Error('1234')
// });
// p1.then(value => {
//     console.log(value)
//     // return 100
// }, reason => console.log(reason.message))
// pro.then().then().then(resolve => console.log(resolve), reject => console.log(reject))

function p1 () {
    return new myPromise(function (resolve, reject) {
      setTimeout(function () {
        resolve('p1')
      }, 1000)
    })
  }
  function p2 () {
    return new myPromise(function (resolve, reject) {
      reject('失败')
    //   resolve('p2');  
    })
  }

//   myPromise.all(['a', 'b', p1(), p2(), 'c']).then( res => console.log(res))
//   myPromise.resolve(p1()).then( res => console.log(res))
  myPromise.race([p1(), p2()]).then( res => console.log('race' + res),rej => console.log('race' + rej))

// p2().finally(() => {
//     console.log('res')
//     return p1()
// }).then(res => {
//     console.log(res)
// },rej=>console.log(rej))

// p2().then(res => {
//     console.log(res)
// }).catch(rea => {
//     console.log('rea'+rea)
// })