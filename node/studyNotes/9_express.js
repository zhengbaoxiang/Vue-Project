// 1 加载模块
const express = require('express')
// 自定义模块
let config = require('../config.js')
global.$config = config

let router = require('./express_modules/expressRouter.js')

//特点：
// 实现路由功能
// 中间件函数
// 扩展req,res
// 集成其他模板引擎

// 2 创建app对象，类似server
let app = express();

// 3 注册路由
// router既是函数也是中间件
// app.use('/', router) 
// 默认路径可省略，等价于下
app.use(router)

// 4 监听
app.listen(8889,function(){
    console.log(`http://localhost:8889`)
})


// 通过中间件监听路由请求，只能是get方法，路径严格匹配login
app.get('/login',function(req,res){
    // res.end('Fate Zero 中文') //中文乱码
    //express封装，内容可以是Buffer，String，Object
    res.send('Fate Zero 中文')
});
// use 方法注册的路由，不区分get,post等，也不严格匹配路径，loginabc也能访问
app.use('/login',function(req,res){
    res.send('use方法')
})

// all 方法注册的路由，不区分get,post等，但是严格匹配路径，loginabc不能访问
app.all('/login',function(req,res){
    res.send('use方法')
})
