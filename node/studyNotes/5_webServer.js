/*
 * @Date: 2022-04-24 09:45:38
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 16:32:40
 * @descript: 作为静态资源服务器使用，承载静态页面，图片css等
 */
const http = require('http')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const URL = require('url')

const config = require('../config')
global.$config = config

http.createServer((req, res) => {
    let url = req.url
    req.pathname = URL.parse(req.url).pathname
    req.query = URL.parse(req.url, true).query
    req.method = req.method.toLowerCase()

    //将自定义方法挂载到res上
    res.render = function (filepath) {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.log('->', err)
                // 非法url等，可以单独写一个404.html 
                let filepath = path.join($config.staticDir, 'html', '404.html')
                res.render(filepath)

            } else if (filepath.includes('404.html')) {
                res.writeHead(404, 'Not Found', {
                    'Content-Type': 'text/html;charset=utf-8'
                })
                res.end(data)
            } else {
                res.setHeader('Content-Type', mime.getType(filepath))
                res.end(data)
            }
        })
    }
    console.log('-url>', req.url)
    console.log('-pathname>', req.pathname)
    //配置url/路由 一定要加斜杠/
    if (url === '/' || url === '/index' || url === '/index.html') {
        let filepath = path.join($config.rootDir, 'resources','index.html')
        res.render(filepath)
    } else if (url === '/login' || url === '/login.html') {
        let filepath = path.join($config.rootDir, 'resources/html', 'login.html')
        res.render(filepath)
    } else {
        // 05 静态资源,图片，文件，css等
        let filepath = path.join($config.staticDir, url)
        res.render(filepath)
    }
}).listen(8085, function () {
    console.log('http://localhost:8085')
})