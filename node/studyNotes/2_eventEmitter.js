/*
 * @Date: 2022-04-25 16:05:21
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-25 16:13:37
 * @FilePath: \node\studyNotes\2_eventEmitter.js
 */
const events = require('events')
// 创建事件实例
const EMITTER = new events.EventEmitter()


// 事件处理函数1
const listener1 = function (arg1, arg2) {
    console.log('listener1', arg1, arg2); 
}
// 事件处理函数2
const listener2 = function (arg1, arg2) {
    console.log('listener2', arg1, arg2); 
}

// 两种方式，将事件关联处理函数
EMITTER.addListener('someEvent',listener1)
EMITTER.on('someEvent',listener2)

// 触发这个事件，并传递参数，此时所有监听器处理函数都会运行
EMITTER.emit('someEvent',{},[]) 

// 移除某个/ 所有监听器
EMITTER.removeListener('someEvent',listener1)
EMITTER.removeAllListeners('someEvent')

// 此时再触发，已没有监听器处理
EMITTER.emit('someEvent')
