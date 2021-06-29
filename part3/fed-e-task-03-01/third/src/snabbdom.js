// import { init } from 'snabbdom/build/package/init'
// import { h } from 'snabbdom/build/package/h'

// const patch = init([])

// // 第一个参数：标签+选择器
// // 第二个参数：如果是字符串就是标签中的文本内容
// // let vnode = h('div#container.cls',{
// //   hook: {
// //     init (vnode) {
// //       console.log(vnode.elm)
// //     },
// //     create (emptyNode, vnode) {
// //       console.log(vnode.elm)
// //     }
// //   }
// // }, 'Hello World')
// let vnode = h('div#container.cls', 'Hello World')
// let app = document.querySelector('#app')
// // 第一个参数：旧的 VNode，可以是 DOM 元素
// // 第二个参数：新的 VNode
// // 返回新的 VNode
// let oldVnode = patch(app, vnode)

// vnode = h('div#container.xxx', 'Hello Snabbdom')
// patch(oldVnode, vnode)

// import {
//   init,
//   classModule,
//   propsModule,
//   styleModule,
//   eventListenersModule,
//   h,
// } from "../../build/index.js";
import { init } from 'snabbdom/build/package/init';
import { h } from 'snabbdom/build/package/h';
import { styleModule } from 'snabbdom/build/package/modules/style';
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners';


let patch = init([styleModule, eventListenersModule]);

let vnode;
let sortBy = "rank";

let data = []
for (let i = 0; i < 10; i++) {
  let a = {
    rank: i,
    title: 'title' + i,
    desc: 'this is desc' + i
  }
  data.push(a)
}

function change(prop) {
  data.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1;
    }
    if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  });

  vnode = patch(vnode, view(data));
}

function add() {
  let a = {
    rank: data.length,
    title: 'title' + data.length,
    desc: 'this is desc' + data.length
  }
  data.unshift(a)
  vnode = patch(vnode, view(data));
}

function remove(index) {
  data.splice(index, 1)
  vnode = patch(vnode, view(data));
}

function movieView(movie,index) {
  return h(
    "div.li",
    {
      key: movie.rank,
      style: {
        padding: '0 16px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        justifyContent: 'space-between',
        opacity: '0',
        delayed: { transition: 'opacity 2s', opacity: '1' },
        remove: { transition: 'opacity 0.3s', opacity: '0' }
      },
    },
    [
      h("div", { style: { fontWeight: "bold" } }, movie.rank),
      h("div", movie.title),
      h("div", movie.desc),
      h(
        "button.btn.rm-btn",
        {
          on: {
            click: () => {
              remove(index);
            },
          },
        },
        "删除"
      ),
    ]
  );
}

function view(data) {
  return h("div", [
    h("h1", "Top 10 movies"),
    h("div", [
      h("button.add", { on: { click: add } }, " 添加 "),
      "排序方式: ",
      h("span.btn-group", [
        h(
          "button.rank",
          {
            class: { active: sortBy === "rank" },
            on: {
              click: () => {
                change("rank");
              },
            },
          },
          " Rank "
        ),
        h(
          "button.title",
          {
            class: { active: sortBy === "title" },
            on: {
              click: () => {
                change("title");
              },
            },
          },
          " Title "
        ),
        h(
          "button.desc",
          {
            class: { active: sortBy === "desc" },
            on: {
              click: () => {
                change("desc");
              },
            },
          },
          " Description "
        ),
      ]),
    ]),
    h(
      "div.list",
      { style: { height: "8px" } },
      data.map(movieView)
    ),
  ]);
}

const addEl = document.querySelector('#app');
vnode = patch(addEl, view(data));
