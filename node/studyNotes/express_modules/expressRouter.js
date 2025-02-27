//路由模块

//自定义的业务模块
let handler = require('./handler.js')


// 创建router函数
const express = require('express')
const router = express.Router()

// 挂载路由
router.get('/', function (req, res) {
    handler.index(req,res)
})

router.post('/add', function (req, res) {
    handler.addPost(req,res)
})

// // 静态资源，1 普通写法
// router.use('/resources',function(req,res){
//     handler.resources(req,res)     
// })

// 静态资源，2 express封装好的静态资源处理方法，直接给路径即可
router.use('/resources',express.static($config.staticDir))


//  返回router
module.exports = router
