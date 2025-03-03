/*
 * @Date: 2022-04-24 09:45:38
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 16:32:33
 * @FilePath: \node\study\express_modules\handler.js
 */
//业务模块
const fs = require('fs')
const path = require('path')

//路径
let dataPath =path.join($config.rootDir,'/',"data.json")
console.log('-dataPath>', dataPath,'<');


//针对不同路由，返回不同的方法，因此返回一个对象，属性为多个方法
module.exports.index = function(req,res){
    // 返回首页
    let filepath = path.join($config.rootDir,'html','index.html')
    // 直接读取文件并返回，如果有模板引擎，则无法处理，但实际上当前已经不会写模板引擎页面了
    // 目前都是前后台分离的，后台只通过数据库返回数据，或者上传下载文件，无需再处理页面或者静态资源这种
    // 因此，此处只需研究如何调用匹配接口，链接数据库，返回数据即可
    res.sendFile(filepath)
}
module.exports.addPost = function(req,res){
      res.send('46465456')
}

module.exports.resources = function(req,res){
    let filepath = path.join($config.staticDir,req.url)
    res.sendFile(filepath)
}