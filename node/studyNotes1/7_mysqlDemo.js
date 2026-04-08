/*
 * @Date: 2022-04-18 15:03:37
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 11:18:13
 * @FilePath: \node\studyNotes\5_mysqlDemo.js
 */
// 1 安装node的mysql插件，引入
const mysql = require('mysql')

// 2 连接数据库
// root@localhost: "root"
const CONNECTTION = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mytest'
})
CONNECTTION.connect()

// 3 增删改查语句，sql可与参数params分开，也可以使用模板字符串拼接
const rawBody = {id:16,name:'zh',url:'r'} // post请求体

//查,
const sql = 'SELECT * FROM websites';
// 模糊匹配,拼接sql，注意  %字符串
const sqlw = `SELECT * FROM websites 
    WHERE url LIKE '%${rawBody.url || ''}%'
`
//增 params字段必须与sql中问号匹配，否则还是直接拼模板字符吧
const addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
var params = ['菜鸟工具3', 'https://c.runoob.com', '23453', 'CN'];
//改
const modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
// var params = ['张飞起飞', 'https://m.3333runoob.com', 15];
//删
const delSql = `DELETE FROM websites where id=${rawBody.id}`;
// params = null

// 常规用法
CONNECTTION.query(addSql, params, function (err, result) {
    if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
    }
    console.log('--------------------------query-success---------------------------');
    //console.log('INSERT ID:',result.insertId);        
    console.log('length:', result.length);
    console.log('result:', result);
    console.log('-----------------------------------------------------------------\n\n');
});



// 利用promise封装一个sql用的公共方法
runSql = function (sql, params = null) {
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