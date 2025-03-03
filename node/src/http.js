/*
 * @Date: 2022-04-22 14:42:23
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 15:45:38
 * @descript: 文件描述
 */
const http = require('http')
const path = require('path')
const formidable = require('formidable')
const URL = require('url')

const expandMethod = require("./libs/expandMethod");
const router = require('./router')

exports.start = function () {
    http.createServer(function (req, res) {
        expandMethod(req, res)

        console.log('-url>',req.url)
        // console.log('-headers>', req.headers)
        
        // 有请求体时（post,put)，需要先获取请求头数据 再分发路由
        // delete 方法的content-length 为0，但是它没有content-type，需要过滤
        if ('content-length' in req.headers && req.headers['content-type']) {
            const str = req.headers['content-type'] || ''
            const type = str.split(';')[0]
            // 文件上传时用的表单
            if (type === 'multipart/form-data') {
                let form = new formidable.IncomingForm()
                form.keepExtensions = true
                form.parse(req, function (err, fields, files) {
                    req.body = fields
                    req.files = files
                    // console.log('->', err)
                    // console.log('->', fields)
                    // console.log('->', files)
                    router(req, res)
                })
            } else {
                // 一般为application/json
                const bufferData = []
                req.on('data', (chunk) => {
                    //chunk 参数是浏览器单次提交的部分数据 buffer类型的数据
                    bufferData.push(chunk)
                })
                req.on('end', () => {
                    //提交完毕了，在此汇总所有dataArray中提交的数据
                    //buffer 合并
                    let queryBuffer = Buffer.concat(bufferData) //<Buffer 75 73 65 72 70 6f 73 74 3d 31 32 33 32 31 33 26 75 73 65 72 70 6f 73 74 32 32 32 32 3d 32 31 33 32 31>
                    //buffer to 字符串，显示为查询格式的字符串
                    let queryStr = queryBuffer.toString('utf-8') //{"pageNum":1,"pageSize":10,"total":0,"data":{}}
                    req.rawBody = JSON.parse(queryStr)
                    // console.log('-queryStr>',queryStr)
                    console.log('-rawBody>',req.rawBody)
                    router(req, res)
                })
            }
        } else { // get 
            //区分静态文件与接口
            if (req.url.includes('resources')) {
                let filepath = path.join($config.rootDir,'/', req.url)
                res.render(filepath)
            } else {
                router(req, res)
            }
        }
    }).listen(8899)

    console.log(`Server running at http://127.0.0.1:8899/`);
}