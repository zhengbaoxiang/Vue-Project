/*
 * @Date: 2022-04-06 10:08:02
 * @LastEditors: zbx
 * @LastEditTime: 2025-03-04 13:36:10
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

import iView from 'view-design'
import i18n from '@/locale'
import {  Message } from "view-design";
Vue.use(iView, { i18n: (key, value) => i18n.t(key, value) })


// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI) // 引入ui框架

import './assets/globalcss.css'
import './assets/globalless.less'
import './index.less'

// 不可挂载到全局使用,会导致app.js体积过大,首屏加载更慢,应该放到单个文件内部懒加载
// import * as echarts from "echarts";
// window.echarts = echarts 

// 网页生成截图
// import html2canvas from "html2canvas";

// 引入自定义指令
import importDirective from '@/directive'
//  注册指令
importDirective(Vue)

//  注册admin内置插件
import installPlugin from '@/plugin'

Message.config({
    top:50,
    duration:3
})
installPlugin(Vue)

// 实际打包时应该不引入mock ,引起导出报错   responseType: 'blob'
require('@/mock')

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


// 生产环境关掉提示
Vue.config.productionTip = false
// 全局配置
Vue.prototype.$config = config

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')   
