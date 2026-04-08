/*
 * @Date: 2022-04-25 16:27:58
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-15 14:54:09
 * @descript: 文件描述
 */
const mime = require('mime') //第三方模块
//1 加载模块
const Http = require('http')

//2 创建http服务对象
let server = Http.createServer()

//3 监听request请求
// request 对象，包含请求报文中的所有内容；response 对象，用来向用户响应数据
server.on('request', function (request, response) {
    // 处理逻辑
    response.write('hello')
    response.end() //必须结束响应
})
//4 启动服务
server.listen(8999, function () {
    console.log(`http://localhost:8999 已启动`)
})

//5 合并2、3、4简写，即可创建一个简易的web服务器
Http.createServer((req, res) => {
    //request 对象常用属性
    let header = req.headers; //请求头
    let arrHeader = req.rawHeaders;//请求头拆分为数组
    let httpVersion = req.httpVersion;//http协议版本
    let method = req.method;//请求方法 post/get等
    let url = req.url; //请求地址

    //response 对象常用属性
    res.statusCode = 200; //状态码
    res.statusMessage = 'okk1'; //状态消息
    res.setHeader('Content-Type', 'text/html;charset=utf-8')  //响应头 设置数据类型
    // res.setHeader('Location','/');//重定向

     //模拟apache静态服务器，通过第三方模块mime 判断数据类型，可以准确设置响应头
    console.log('->', url, mime.getType(url), '<')
    let ContentType = mime.getType(url) || 'text/html;charset=utf-8'
    res.setHeader('Content-Type', ContentType) 

    //三条合并 writeHead 放在setHeader后 否则报错，默认就会调用，且覆盖，一般只设置响应头即可
    // res.writeHead(200, 'okk2', {
    //     'Content-Type': ContentType
    // })

    //响应内容
    res.write('hello <h1>设置响应报文头，才能显示中文不乱码<h1>')

    res.end() //必须结束响应
}).listen(8084, () => {
    console.log(`http://localhost:8084 已启动`)
})
