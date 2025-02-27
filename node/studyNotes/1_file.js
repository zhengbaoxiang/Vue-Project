/*
 * @Date: 2022-04-25 15:36:58
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-25 16:40:49
 * @FilePath: \node\studyNotes\1_file.js
 */
// fs 文件系统模块，需要加载才能使用
//1 载入文件系统模块
const fs = require('fs')

//此处./ 相对路径path，表示相对于执行node命令时的路径，不是当前执行文件的路径，
// 比如我在外层文件夹执行命令 node .\studyNotes\1_file.js ，文件是创建在上层的，不是相对当前文件
let filePath = './msg.txt'
const data = '这是一段文本字符串abc' + ' ' + 'asdfdasf'

//2 文件写入
//  异步 fs.writeFile(file, data[, options], callback),(文件名，数据，回调)
//  同步方法 fs.writeFileSync(file, data[, options])

fs.writeFile(filePath, data, 'utf-8', function (err) {
    if (err) {
        console.log(`唯一参数${err},有输出表示是出错了`)
        // throw err
    }
    console.log(`参数${err} == null表示写入成功`)
})

//3 文件读取
//  异步方法：fs.readFile(path[, options], callback)
//  同步方法：fs.readFileSync(path[, options])

//  如果没有指定 encoding =>'utf8'，则返回原始的 buffer,使用data.toString('utf8')可转换为原始字符串
// filePath = './resources/1234.xls' //根据实际业务类型，确认encoding配置? 'binary','utf8' 

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log('->',err)
        // throw err //抛出异常会导致服务器停掉，一般不用
    }
    console.log(`读取的内容为:\n`, data)

    process.stdout.write('*********************\n')
})


// 4  创建文件夹
// mkdir(path,callback)

//此处./ 相对路径path，表示相对于执行node命令时的路径，不是当前执行文件的路径，
fs.mkdir('./我的文件夹', (err) => {
    if (err) {
        console.log('->', err)
        // throw err
    } else {
        fs.mkdir('./我的文件夹/第二层文件夹1', (err) => {
            if (err) {
                console.log('->', err)
                // throw err
            } else {
                fs.mkdir('./我的文件夹/第二层文件夹1/孙子文件夹', (err) => {
                    console.log('孙子文件夹完成', err)
                })
                console.log('=======> done1')
            }
        })
        fs.mkdir('./我的文件夹/第二层文件夹2', (err) => {
            if (err) {
            } else {
                console.log('->', err)
                // throw err
                console.log('=======> done2')
            }
        })
    }
})


// 5 解决相对路径问题
// __dirname,正在执行的js文件所在的完整目录
// __filename，正在执行的js文件所在的完整路径 。路径比目录多: \filename.js
console.log(__dirname)
console.log(__filename)

const Path = require('path')

let newpath = Path.join(__dirname, '../filename.txt')
console.log(`newpath：  ${newpath}`)

