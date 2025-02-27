/*
 * @Date: 2022-04-27 14:16:34
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 15:39:38
 * @descript: 文件描述
 */

module.exports = {
    // 列表查询 success
    list: function (req, res) {
        const rawBody = req.rawBody
        // 3、 拼接sql,注意加''
        const sql = `
            SELECT 
            a.id,
            a.user_id as userId,
            a.user_name as username,
            a.role_code as roleCode,
            a.status,
            a.update_time as updateTime,
            b.role_name as roleName
        FROM user a
        LEFT JOIN role b ON a.role_code = b.role_code
        WHERE a.user_name LIKE '%${rawBody.data.keyword || ''}%' OR  a.user_id LIKE '%${rawBody.data.keyword || ''}%'
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
        // 新增之前，应该先查询一下表里有没有userId，用户名不能重复 todo
       
        const sql = 'INSERT INTO user VALUES(0,?,?,?,?,?,?)';
        const params = [rawBody.userId, rawBody.username, rawBody.password || '123456', rawBody.roleCode,rawBody.status,new Date()]

        runSql(sql, params).then(result => {
            res.handleSuccess()
        }).catch((err) => {
            res.handleError(err)
        })
    },
    update: function (req, res) {

        const sql = 'UPDATE user SET user_id = ?,user_name = ?,role_code = ?,status = ? ,update_time = ?  WHERE Id = ?';
        const rawBody = req.rawBody
        const params = [rawBody.userId, rawBody.username, rawBody.roleCode, rawBody.status, new Date(),rawBody.id]

        runSql(sql, params).then(result => {
            res.handleSuccess()
        }).catch((err) => {
            res.handleError(err)
        })

    },
    delete: function (req, res) {
        var sql = 'DELETE FROM user where id= ?';
        const params = [req.query.id]
        runSql(sql, params).then(result => {
            res.handleSuccess()
        }).catch((err) => {
            res.handleError(err)
        })
    },
}
