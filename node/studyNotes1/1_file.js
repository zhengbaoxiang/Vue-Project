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

//2 覆盖文件写入
//  异步 fs.writeFile(file, data[, options], callback),(文件名，数据，回调)
//  同步方法 fs.writeFileSync(file, data[, options])
fs.writeFile(filePath, data, 'utf-8', function (err) {
    if (err) {
        console.log(`唯一参数${err},有输出表示是出错了`)
        // throw err
        return
    }
    console.log(`参数${err} == null表示writeFile成功`)
})
// 2 追加写入日志
fs.appendFile(filePath, '\n这是追加的内容', 'utf-8', function (err) {
    if (err) {
        console.log(`唯一参数${err},有输出表示是出错了`)
        // throw err
        return
    }
    console.log(`参数${err} == null表示appendFile成功`)
})



//3 文件读取
//  异步方法：fs.readFile(path[, options], callback)
//  同步方法：fs.readFileSync(path[, options])

//  如果没有指定 encoding =>'utf8'，则返回原始的 buffer,使用data.toString('utf8')可转换为原始字符串
// filePath = './resources/1234.xls' //根据实际业务类型，确认encoding配置? 'binary','utf8' 

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log('->', err)
        // throw err //抛出异常会导致服务器停掉，一般不用
    }
    console.log(`读取的内容为:\n`, data)
    process.stdout.write('*********************\n')
})
// 同步方法读取文件内容
let syncResult = fs.readFileSync(filePath, 'utf8')





// 5 解决相对路径问题
// __dirname,正在执行的js文件所在的完整目录
// __filename，正在执行的js文件所在的完整路径 。路径比目录多: \filename.js
console.log(__dirname)
console.log(__filename)

const Path = require('path')

let newpath = Path.join(__dirname, '../filename.txt')
console.log(`newpath：  ${newpath}`)


// 查询文件是否存在, 删除文件
fs.access('./msg.txt', (err) => {
    console.log(`文件是否存在：${!err}`)
    if (!err) {
        // 删除文件
        // fs.unlink('./msg.txt', (err) => {
        //     if (err) {
        //         console.log('->', err)
        //         return
        //     } 
        //         console.log(`文件已删除`)
        // })
    }
})

// 查询文件夹是否存在，在的话删了，rm 、 rmdir 递归删除文件夹需要设置{ recursive: true }
fs.access('./我的文件夹', (err) => {
    if (!err) {
        // node 14.4.0 版本后才支持，否则使用 rmdir ,rmdirSync
        fs.rm('./我的文件夹', { recursive: true }, (err) => {
            console.log('->', err)
            // throw err
        })
    }
})

// 4  创建文件夹
// mkdir(path,callback)
// //此处./ 相对路径path，表示相对于执行node命令时的路径，不是当前执行文件的路径，
// fs.mkdir('./我的文件夹', (err) => {
//     if (err) {
//         console.log('->', err)
//         // throw err
//     } else {
//         fs.mkdir('./我的文件夹/第二层文件夹1', (err) => {
//             if (err) {
//                 console.log('->', err)
//                 // throw err
//             } else {
//                 fs.mkdir('./我的文件夹/第二层文件夹1/孙子文件夹', (err) => {
//                     console.log('孙子文件夹完成', err)
//                 })
//                 console.log('=======> done1')
//             }
//         })
//         fs.mkdir('./我的文件夹/第二层文件夹2', (err) => {
//             if (err) {
//             } else {
//                 console.log('->', err)
//                 // throw err
//                 console.log('=======> done2')
//             }
//         })
//     }
// })

// 读取文件夹内容
fs.readdir('./studyNotes1', (err, files) => {
    if (err) {
        console.log('->', err)
        // throw err
    } else {
        console.log('读取文件夹内容', files)
    }
})
fs.readdirSync('./studyNotes1').forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
})






// 持久化的写入时，使用流式写入
const ws = fs.createWriteStream('./stream.txt')
ws.write('这是流式写入的内容1\n')
ws.write('这是流式写入的内容2\n')
ws.write('这是流式写入的内容3\n')

// 持久化的读取时，使用流式读取
fs.createReadStream('./stream.txt', 'utf8').on('data', (chunk) => {
    console.log(`读取的内容为：\n${chunk}`)
})

// 复制一个文件,小文件直接读取写入即可，大文件使用流式读写

let content = fs.readFileSync('./msg.txt', 'utf8')
fs.writeFileSync('./msg_copy.txt', content, 'utf8')

// 复制一个文件，使用流式写入，
let rs = fs.createReadStream('./msg.txt', 'utf8')
let ws2 = fs.createWriteStream('./msg_copy2.txt')
// pipe是管道，直接把读取的内容写入到另一个文件中
//  rs.pipe(ws2)
rs.on('data', (chunk) => {
    ws2.write(chunk)
})

// 重命名文件

fs.renameSync('./msg_copy.txt', './msg_copy3.txt')
