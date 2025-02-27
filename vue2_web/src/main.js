/*
 * @Date: 2022-04-06 10:08:02
 * @LastEditors: zbx
 * @LastEditTime: 2022-07-26 14:37:25
 * @FilePath: \management\src\main.js
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import config from '@/config'

import importDirective from '@/directive'

import iView from 'view-design'
import i18n from '@/locale'
import './index.less'
import {  Message } from "view-design";

// 不可挂载到全局使用,会导致app.js体积过大,首屏加载更慢,应该放到单个文件内部懒加载
// import * as echarts from "echarts";
// window.echarts = echarts 

// 网页生成截图
// import html2canvas from "html2canvas";

//  注册admin内置插件
import installPlugin from '@/plugin'

Vue.use(iView, { i18n: (key, value) => i18n.t(key, value) })
Message.config({
    top:50,
    duration:3
})
installPlugin(Vue)

// 树状表格 iview 已支持children 字段，可替代此插件
// import TreeTable from 'tree-table-vue'
// Vue.use(TreeTable)

// 树形架构插件,绘制树状结构图，组织架构图等
// import VOrgTree from 'v-org-tree'
// import 'v-org-tree/dist/v-org-tree.css'
// Vue.use(VOrgTree)

// npm install --save-dev bpmn-js
// npm install --save bpmn-js-properties-panel
// npm install --save camunda-bpmn-moddle
// 以下为 bpmn-js 工作流绘图工具的样式
// import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

// 树结构选择框 ，用于选择树状组织架构或者菜单树等
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// Vue.component('treeselect', Treeselect)

// 实际打包时应该不引入mock ,引起导出报错   responseType: 'blob'
// if (process.env.NODE_ENV !== 'production') require('@/mock')
require('@/mock')

// 生产环境关掉提示
Vue.config.productionTip = false
// 全局配置
Vue.prototype.$config = config

//  1 vue的全局消息推送，单页面内部通信
window.$Bus = new Vue()

//  事件中心，原理
const eventManger = {
    handlers: {},
    addHandler: function (type, handler) {
        if (typeof handler !== 'function') return
        // 可优化，事件添加，直接覆盖
        if (typeof this.handlers[type] === 'undefined') {
            this.handlers[type] = []
            this.handlers[type].push(handler)
        }
    },
    removeHandler: function (type, handler) {
        var events = this.handlers[type] || []
        for (var i = 0, len = events.length; i < len; i++) {
            if (events[i] == handler) {
                events.splice(i, 1)
                break
            }
        }
    },
    trigger: function (type) {
        // 如果有订阅的事件，这个时候就触发了
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type]
            var args = Array.prototype.slice.call(arguments, 1)
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].apply(null, args)
            }
        }
    }
}
// 仿vue的事件名，手写的事件处理方法,可以避免多次监听，重复触发的问题 to完善
window.$EventBus = {
    $on: function (type, event) {
        eventManger.addHandler(type, event)
    },
    $off: function (type, event) {
        eventManger.removeHandler(type, event)
    },
    $emit: function (type, params) {
        eventManger.trigger(type, params)
    },
}

// 3 全局广播推送，实现页面间通信
window.$broadChannel = new BroadcastChannel("fundChannel");
$broadChannel.onmessage = (e) => {
    // console.log('-onmessage>',e)
    const data = e.data;
    console.log("receive message:", data);
    if (data.type === 'dialogueList') {
        $Bus.$emit('updateDialogueList')
    } else if (data.type === 'reviewList') {
        $Bus.$emit('updateReviewList')
    }
};
const msgData = { type: "dialogueList" }
$broadChannel.postMessage(msgData);

// 4 监听localStorage.setItem(),但是只有改变时会触发
window.addEventListener("storage", function (e) {
    console.log('-storage>',e,e.newValue)
});

//  注册指令
importDirective(Vue)

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app')   
