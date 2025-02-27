/*
 * @Date: 2022-04-22 14:47:40
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-23 09:26:59
 * @FilePath: \node\src\libs\tools.js
 */
const fs = require('fs')
const path = require('path')
const mime = require('mime')

const URL = require('url')

const buffer = require('buffer')
// 最新的buffer包含两个类，Buffer是全局对象，Blob 在18版本才会挂载到全局
const Blob = buffer.Blob
const Buffer = buffer.Buffer
// console.log('-buffer>',buffer)
// console.log('-Buffer>',Buffer)
// console.log('-Blob>',Blob)

module.exports = function (req, res) {
    req.pathname = URL.parse(req.url).pathname
    req.query = URL.parse(req.url, true).query
    req.method = req.method.toLowerCase()

    res.handleSuccess = function (data = null) {
        res.writeHead(200, { "Content-Type": "application/json;text/plain" });
        const resData = {
            code: 200,
            data: data,
            msg: '操作成功'
        }
        res.write(JSON.stringify(resData));
        res.end()
    }
    res.handleError = function (err) {
        console.log('->', err, '<');
        res.writeHead(200, { "Content-Type": "application/json;text/plain" });
        const resData = {
            code: "999",
            data: null,
            msg: err.msg || err || '发生异常'
        }
        res.write(JSON.stringify(resData));
        res.end()
    }

    res.handle404 = function (err) {
        res.writeHead(404, { "Content-Type": "application/json;text/plain" });
        const resData = {
            code: "404",
            data: null,
            msg: err.msg || '404 Not Found'
        }
        res.write(JSON.stringify(resData));
        res.end()
    }

    res.sendFileData = function (filePath,filename) {
        // 不指定 encoding = 'binary' 则返回原始的buffer数据<Buffer ff 00 ,前台需设置responseType: 'blob'
        // 如果前台启用了mock,则返回的buffer可能会无法识别，因此可以设置二进制binary,多次尝试返回数据格式
        fs.readFile(filePath,'binary', (err, data) => {
            if (err) {
                // throw err
                res.handleError(err)
            } else {
                try {
                    console.log('-filePath>',filename,filePath) 

                    res.setHeader("Content-disposition", "attachment;filename=" + encodeURI( filename))
                    res.setHeader('Content-Type', mime.getType(filename))
                    // res.setHeader('Content-Type', 'application/octet-stream')

                    // console.log('-data>',data)
                    // res.write(data);


                    //启用了mock,
                    // const fileData = data.file

                    // 若readFile不设置读取文件格式，则 data === buf 
                    // 通过这个方法，前台将二进制文件流转换为buffer,，
                    const buf = Buffer.from(data, 'binary');
                    // console.log('-buf>',buf)
                    res.write(buf);


                    // // 将buffer转换为blob
                    const blobFile = new Blob([buf], { type: mime.getType(filename) || "application/octet-stream" })
                    console.log('-blobFile>',blobFile)

                    // res.write(buf);
                    res.end()
                } catch (err) {
                    res.handleError(err)
                }
            }
        })

    }

    // 静态文件处理
    res.render = function (filepath) {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                res.writeHead(404, 'No Found', {
                    'Content-Type': 'text/html;charset=utf-8'
                })
                res.end('404  NO Found')
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

}






