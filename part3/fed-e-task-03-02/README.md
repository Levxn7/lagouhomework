## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

### 简答题

#### 1、请简述 Vue 首次渲染的过程。


在首次渲染之前，先进行vue的初始化，初始化实例成员，静态成员，当初始化结束后调用vue的构造函数，在构造函数中调用了init方法，这个方法相当于整个文件的入口
方法中调用了$mount

第一个$mount通过compileToFunction帮我们把模板编译成render函数，存入options.render中
第二个$mount中重新获取$el

调用mountComponent，先判断是否是render选项，如果没有，但是传入的是模板并且是运行版本时，版本会被警告不支持编译器
触发beforemount，定义updateComponent，调用render生成虚拟dom和update方法将虚拟dom转换成真实dom并挂载到页面上来

创建watcher对象，传入了updateComponent函数，在watcher中调用，调用的get方法
创建完watcher会调用一个get方法，在get中调用updateComponent，updateComponent中会调用render和update两个方法

render的作用是创建虚拟dom，最终调用的用户传入的或者模板编译的render
返回vnode，调用vm.\_update，在其中调用\__patch__ 这个方法将虚拟dom转换成真实dom并挂载到页面上来，真实dom渲染到$el中

触发mounted 挂载结束 返回vue实例


#### 2、请简述 Vue 响应式原理。


响应式是从vue实例的init方法开始的，在init方法中先调用initState()方法初始化vue实例的状态
在其中调用了initData，这个方法是把data属性注入到vue实例上，并且调用observe把data对象转换成响应式的对象，observe就是响应式的入口

observe接受一个参数，这个参数就是响应式要处理的对象，observe在src/corelobserver/index.js中，先判断value是否是对象，如果不是对象就直接返回
然后判断value对象是否有\__ob__属性，,如果有就说明这个对象已经做过响应式处理，直接返回，如果没有，就创建observer对象，返回observer 对象

Observe类会给value对象定义一个不可枚举的\__ob__属性，并把这个属性记录到当前的observer中，然后给对象做响应式处理
数组的处理就是设置几个特殊的方法，方法会改变数组，会发送通知，找到dep方法调用，遍历成员，调用observe
对象的处理会调用walk方法，遍历对象，给每个属性调用defineReactive方法

defineReactive会给每个属性创建dep对象，让dep去收集依赖，如果当前属性是对象，就调用observe，要把这个对象变成响应式
定义getter收集依赖，包括对象的子对象
定义setter保存新值，如果新值是对象，就调用observe，发送通知，调用dep.notify

依赖收集：首先执行watcher对象中的get方法，调用pushTarget把watcher对象记录到dep.target属性中
在访问data中的成员的时候收集依赖，触发defineReactive中的getter收集依赖，把属性对应的watcher对象添加到dep的subs数组中，也就是为属性收集依赖，如果属性的值是个对象，就创建一个childOb收集依赖，目的是子对象添加和删除成员时发送通知

watcher：当数据发生变化的时候通过dep.notify发送通知，他会调用watcher对象的update方法，在update方法中会调用queueWatcher函数，来判断watcher是否被处理了，如果没有就添加到queue队列，并调用flushSchedulerQueue刷新队列
flushSchedulerQueue会触发beforeUpdata钩子函数，然后调用watcher.run函数，在其中调用run-->get-->getter-->updateComponent
调用run方法之后，就可以在页面上看到数据了

清空上一次的依赖，重置watcher的状态，然后触发actived钩子函数，然后触发updated钩子函数
　

#### 3、请简述虚拟 DOM 中 Key 的作用和好处。


key主要用在Vue的虚拟DOM算法，在新旧nodes对比时辨识VNodes。如果不使用key，Vue会使用一种最大限度减少动态元素并且尽可能的尝试就地修改\复用相同类型元素的算法。而使用key时，它会基于key的变化重新排列元素顺序，并且会移除key不存在的元素。有相同父元素的子元素必须有独有的key。重复的key会造成渲染错误。

设置key比不设置的dom操作要少很多，减少diff和渲染所需要的时间，提升了性能。


#### 4、请简述 Vue 中模板编译的过程。

　
 入口函数是compileToFunctions，在这个函数中先从缓存中加载编译好的render函数，如果缓存中没有的话就调用compile函数
 在compile函数中，首先去合并options选项，然后调用baseCompile编译模板，compile的核心是合并选项，真正的处理是在baseCompile中完成的

 把模板和合并后的选项传递给baseCompile函数，baseCompile完成了编译核心的以下三件事情
 parse函数把模板转换成AST对象 也就是抽象语法树
 optimize函数标记AST中的静态根节点，静态根节点不需要被重绘，patch的过程中会跳过静态根节点
 generate函数把优化过后的AST对象转换成字符串形式的js代码

 当compile执行完毕后，回到入口文件compileToFunctions，此处会继续把字符串形式的代码转换为函数的形式，然后调用createFuntion，当render和staticFuntion执行完毕，挂在到vue实例的options对应的属性上
 
 所以，不要在代码中写入无意义的空白和换行，这些空白和换行都会被存储到内存中，对浏览器的渲染是毫无意义的
 

　

　