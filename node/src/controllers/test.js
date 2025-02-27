/*
 * @Date: 2022-04-22 15:55:42
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 17:59:55
 * @FilePath: \node\src\controllers\test.js
 */
const path = require('path')
const fs = require('fs')


module.exports = {
    // 列表查询 success
    getList: function (req, res) {
        const rawBody = req.rawBody
        // 1、 全查
        // const sql = 'SELECT * FROM websites';

        // 2、 分开传参
        // const sql = "SELECT * FROM websites WHERE name LIKE ?";
        // const params = ['%'+ (rawBody.data.name || '') + '%']

        // 3、 拼接sql,注意加''
        const sql = `SELECT * FROM websites 
            WHERE name LIKE '%${rawBody.data.name || ''}%'
        `

        runSql(sql, params = null).then(result => {
            const data = {
                total: result.length,
                list: result
            }
            res.handleSuccess(data)
        }).catch((err) => {
            res.handleError(err)
        })
    },
    add: function (req, res) {
        const rawBody = req.rawBody

        const sql = 'INSERT INTO websites  VALUES(0,?,?,?,?)';
        const params = [rawBody.name, rawBody.url, rawBody.alexa, rawBody.country]

        runSql(sql, params).then(result => {
            res.handleSuccess()
        }).catch((err) => {
            res.handleError(err)
        })
    },
    update: function (req, res) {

        const sql = 'UPDATE websites SET name = ?,url = ?,alexa = ?,country = ?  WHERE Id = ?';
        const rawBody = req.rawBody
        const params = [rawBody.name, rawBody.url, rawBody.alexa, rawBody.country, rawBody.id]

        runSql(sql, params).then(result => {
            res.handleSuccess()
        }).catch((err) => {
            res.handleError(err)
        })

    },
    delete: function (req, res) {
        var sql = 'DELETE FROM websites where id= ?';
        const params = [req.query.id]
        runSql(sql, params).then(result => {
            res.handleSuccess()
        }).catch((err) => {
            res.handleError(err)
        })
    },
    getDetail: function (req, res) {
        const sql = 'SELECT * FROM websites where id= ?';
        const params = [req.query.id]

        runSql(sql, params).then(result => {
            if (result.length > 0) {
                const data = result[0]
                res.handleSuccess(data)
            } else {
                const err = {
                    msg: '未查到相关数据'
                }
                res.handleError(err)
            }
        }).catch((err) => {
            res.handleError(err)
        })
    },



 
    uploadFile: function (req, res) {
        const fileData = req.files.file // 插件获取到的上传文件信息
        // console.log('-fileData>', fileData)
 
        const fileName = req.body.fileName || req.files.originalFilename  //原始文件名
        const ext = fileName.split('.')[1]
        const randomName = 'img'+ '_'+new Date().getTime() + '.' + ext  // 利用时间戳命名，独一无二
        
        const savePath = path.join($config.uploadPath, randomName) // 存储地址拼接
        
     

        fs.readFile(fileData.filepath, (err, data) => {
            if (err) {
                res.handleError(err)
            } else {
                // "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.
                fs.writeFile(savePath, data, (err) => {
                    if (err) {
                        res.handleError(err)
                    } else {
                        addToSql()
                    }
                })
            }
        })

        function addToSql (){
            const sql = `INSERT INTO files values(0,?,?,?,?)`
            const params = [fileData.originalFilename,savePath ,'',new Date()] 
            runSql(sql, params).then(result => {
                res.handleSuccess(result.insertId)
            }).catch((err) => {
                res.handleError(err)
            })
        }








    },
    getFile: function (req, res) {

        const sql = 'SELECT * FROM files where id= ?';
        const params = [req.query.id]


        runSql(sql, params).then(result => {
            if (result.length > 0) {
                const data = result[0]
                const filePath = data.filepath
                const filename = data.filename
                // let filePath = path.join($config.uploadPath, query.fileName)
                res.sendFileData(filePath,filename) 

            } else {
                const err = {
                    msg: '未查到相关数据'
                }
                res.handleError(err)
            }
        }).catch((err) => {
            res.handleError(err)
        })
    },
      // 列表查询 success
      getFilelist: function (req, res) {
        // 3、 拼接sql,注意加''
        const sql = `
            SELECT 
            *
            FROM files
        `
        runSql(sql, params = null).then(result => {
            const data = {
                total: result.length,
                list: result
            }
            res.handleSuccess(data)
        }).catch((err) => {
            res.handleError(err)
        })
    },
}
