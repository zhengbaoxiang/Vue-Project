/*
 * @Date: 2022-04-24 10:17:26
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 16:22:40
 * @descript: 作为后台服务器，链接数据库，承载api路由分发
 */
// 引入全局配置
const config = require('./config')
global.$config = config

// 链接数据库
require('./src/mysql.js')

// 启动服务
const myHttp = require('./src/http.js')
myHttp.start()