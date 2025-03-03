/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 13:08:45
 * @FilePath: \management\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'

import store from '@/store'
import iView from 'view-design'
import config from '@/config'

import { getToken, canTurnTo, setTitle } from '@/libs/util'

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'history',
    base: config.publicPath
})
const LOGIN_PAGE_NAME = 'login'
const HOME_NAME = 'home'

const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routes)) {
        next()
    } else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const token = from.query.token || to.query.token || getToken();

    console.log('--beforeEach->', token, to.name, '<---');
    let debug = false
    if(debug) {
        next() // 跳转
        return
    }

    if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: HOME_NAME // 跳转到homeName页
        })
    } else {
        store.commit('setToken', token);
        if (store.state.user.hasGetInfo) {
            turnTo(to, store.state.user.access, next);
        } else {
            store.dispatch('getUserInfo', token).then(access => {
                // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，
                // 如：['super_admin'] ['super_admin', 'admin']
                turnTo(to, access, next);
                // next()
            }).catch(err => {
                // turnTo(to, access, next);
                console.log(err)
                store.commit('setToken', '');
                next({
                    name: LOGIN_PAGE_NAME // 鉴权接口如果报错，跳转到登录页
                })
            });
        }
    }
})

router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router

/**
 * https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
 * 完整的导航解析流程
    导航被触发。
    在失活的组件里调用 beforeRouteLeave 守卫。
    调用全局的 beforeEach 守卫。
    在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
    在路由配置里调用 beforeEnter。
    解析异步路由组件。
    在被激活的组件里调用 beforeRouteEnter。  该守卫 不能 访问 this
    调用全局的 beforeResolve 守卫 (2.5+)。
    导航被确认。
    调用全局的 afterEach 钩子。
    触发 DOM 更新。
    调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
 */
