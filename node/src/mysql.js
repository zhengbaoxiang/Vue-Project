/*
 * @Date: 2022-04-22 14:43:08
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 16:19:16
 * @FilePath: \node\src\mysql.js
 */
const mysql = require('mysql')

const CONNECTTION = mysql.createConnection($config.mysqlOption)
CONNECTTION.connect()

console.log('-CONNECTTION-start>');

// 利用promise封装一个sql用的公共方法
global.runSql = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        CONNECTTION.query(sql, params, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
}