/*
 * @Date: 2021-10-09 09:35:16
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-21 15:37:17
 * @FilePath: \management\src\config\index.js
 */
// console.log('-process.env->', process.env, '<-')

export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '后台管理系统',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,

    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    },

    // api请求基础路径
    baseUrl: process.env.VUE_APP_BASE_APIURL,
    // 页面服务器的基础路径
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    // 前端服务器的域名
    serviceHost: process.env.VUE_APP_SERVICE_HOST,

    authHost: process.env.VUE_APP_AUTH_HOST, // 登录认证的地址
    authServiceId: process.env.VUE_APP_SERVICE_ID, // cas认证所需的id

    loginUrl: `${process.env.VUE_APP_AUTH_HOST}?redirect=${process.env.VUE_APP_SERVICE_HOST + process.env.VUE_APP_PUBLIC_PATH}login`

}
