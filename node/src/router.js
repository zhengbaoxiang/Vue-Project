/*
 * @Date: 2022-04-22 14:42:14
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 09:31:26
 * @descript: 文件描述
 */

module.exports = function (req, res) {
    const paths = req.pathname.split('/')
    const controller = paths[1] || 'home'
    const action = paths[2] || 'index'
console.log('->',controller,action)
    let modulex
    try {
        modulex = require(`./controllers/${controller}`)
        const handler = modulex[action]
        if (handler) {
            handler.apply(null, [req, res])
        } else {
            res.handle404({ msg: '接口地址不匹配' })
        }
    } catch (err) {
        console.log('->',err)
        res.handle404(err)
        return
    }


}

