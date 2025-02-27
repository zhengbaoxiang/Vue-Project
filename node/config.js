/*
 * @Date: 2022-04-22 16:22:06
 * @LastEditors: zbx
 * @LastEditTime: 2025-02-25 15:28:08
 */
const path = require('path')
module.exports = {
    rootDir: path.join(__dirname),
    staticDir: path.join(__dirname, "resources"),
    uploadPath: path.join(__dirname, "resources/upload"),
    // root@localhost: "root"
    mysqlOption: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'mytest',
    },

}