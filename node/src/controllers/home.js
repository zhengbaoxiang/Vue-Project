/*
 * @Date: 2022-04-20 16:53:40
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 09:22:11
 * @FilePath: \node\src\controllers\home.js
 */
const path = require('path')

module.exports = {
    index: function (req, res) {
        let filepath = path.join($config.rootDir,'/','index.html')
        res.render(filepath)
    }
}

