/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-07-26 16:06:36
 * @FilePath: \management\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //
        userName: '根模块的变量'
    },
    mutations: {
        //
    },
    actions: {
        //
    },
    modules: {
        user,
        app
    }
})
