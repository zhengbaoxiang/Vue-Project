/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 13:47:24
 * @FilePath: \management\src\plugin\error-store\index.js
 */
import store from '@/store'
export default {
  install (Vue, options) {
    if (options.developmentOff && process.env.NODE_ENV === 'development') return
    Vue.config.errorHandler = (error, vm, mes) => {
      let info = {
        type: 'script',
        code: 0,
        mes: error.message,
        url: window.location.href
      }
      Vue.nextTick(() => {
        store.dispatch('addErrorLog', info)
      })
    }
  }
}
