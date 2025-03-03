
const loginUsers = {} //暂时充当全局缓存对象，保存登录的用户
module.exports = {
    login: function (req, res) {
        const rawBody = req.rawBody
        const sql = `
        SELECT 
            a.id,
            a.user_id as userId,
            a.user_name as username,
            a.password,
            a.role_code as roleCode,
            a.update_time as updateTime,
            b.role_name as roleName
        FROM user a
        LEFT JOIN role b ON a.role_code = b.role_code
        WHERE a.user_id ='${rawBody.username}'
            `
        // console.log('->', sql)
        runSql(sql, params = null).then(result => {
            const userInfo = result[0]

            if (!userInfo) {
                res.handleError({
                    msg: '用户不存在'
                })
            } else if (userInfo.password === rawBody.password) {
                // 登录成功，一般需要返回token,同时缓存当前登录用户信息。
                delete userInfo.password  //去掉密码
                const token = getToken()
                loginUsers[token] = userInfo
                // console.log('-loginUsers:>', loginUsers)
                const data = {
                    token: token,
                    userInfo
                }
                res.handleSuccess(data)
            } else {
                res.handleError({
                    msg: '密码错误'
                })
            }
        }).catch((err) => {
            res.handleError(err)
        })
    },

    logout: function (req, res) {
        // 登出接口，清掉缓存用户信息，直接返回成功即可
        console.log('-headers-token>', req.headers.token)
        const token = req.headers.token
        // loginUsers[token] = null // 应该删掉这个属性
        delete loginUsers[token]
        res.handleSuccess()
    },
    getUserAuth: function (req, res) {
        // 根据token 获取当前登录信息
        console.log('-headers-token>', req.headers.token)
        const token = req.headers.token

        if (loginUsers[token]) {
            res.handleSuccess(loginUsers[token])
        } else {
            res.handleError({ msg: 'token已失效' })
        }
    },
}

function getToken(){
    return  't' + new Date().getTime() 
}
