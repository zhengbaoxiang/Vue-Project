// ============================================================
//  基础配置
// ============================================================
const fs = require('fs')
const path = require('path')


// __dirname: 当前执行文件所在的完整目录
// __filename: 当前执行文件的完整路径
console.log('__dirname:', __dirname)
console.log('__filename:', __filename)

// 演示用的根目录
const baseDir = path.join(__dirname, 'fileOpsDemo')

// 同步暂停函数（阻塞方式，方便观测）
const sleepSync = ms => {
    const end = Date.now() + ms
    while (Date.now() < end) {}
}


// ============================================================
// 1 场景1: 检查文件夹是否存在，不存在则创建
// ============================================================
console.log('\n=== 场景1: 文件夹操作 ===')

// 同步方法
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
    console.log('已创建文件夹:', baseDir)
} else {
    console.log('文件夹已存在:', baseDir)
    // 清空文件夹内容（删除所有文件和子文件夹）
    fs.readdirSync(baseDir, { withFileTypes: true }).forEach(item => {
        const itemPath = path.join(baseDir, item.name)
        if (item.isDirectory()) {
            fs.rmSync(itemPath, { recursive: true })
        } else {
            fs.unlinkSync(itemPath)
        }
    })
    console.log('已清空文件夹内容')
    sleepSync(3000)  // 暂停3秒，方便观测
}

// 异步 Promise 版本 (async/await)
// async function createFolder() {
//     try {
//         await fs.promises.mkdir(baseDir, { recursive: true })
//         console.log('文件夹创建成功')
//     } catch (err) {
//         console.error('创建失败:', err)
//     }
// }

// ============================================================
// 2 场景2: 检查文件是否存在，存在则删除后重新创建
// ============================================================
console.log('\n=== 场景2: 文件创建(覆盖) ===')

const demoFile = path.join(baseDir, 'demo.txt')

// 同步方法 - 删除旧文件后重新写入
if (fs.existsSync(demoFile)) {
    fs.unlinkSync(demoFile)
    console.log('已删除旧文件:', demoFile)
}
fs.writeFileSync(demoFile, '这是新创建的文件内容\n第二行内容', 'utf-8')
console.log('已写入新文件:', demoFile)

// 异步 Promise 版本 (async/await)
// async function createFile() {
//     try {
//         await fs.promises.access(demoFile)
//         await fs.promises.unlink(demoFile)
//     } catch {}
//     await fs.promises.writeFile(demoFile, '新内容', 'utf-8')
// }

// ============================================================
// 3 场景3: 追加写入文件
// ============================================================
console.log('\n=== 场景3: 追加写入 ===')

fs.appendFileSync(demoFile, '\n这是追加的内容', 'utf-8')
console.log('已追加内容到:', demoFile)

// 异步 Promise 版本
// async function appendContent() {
//     await fs.promises.appendFile(demoFile, '\n追加内容', 'utf-8')
// }

// ============================================================
// 4 场景4: 读取整个文件内容
// ============================================================
console.log('\n=== 场景4: 读取文件 ===')

// 同步方法
const content = fs.readFileSync(demoFile, 'utf-8')
console.log('读取的文件内容:\n', content)

// 异步 Promise 版本
// async function readFile() {
//     const content = await fs.promises.readFile(demoFile, 'utf-8')
//     console.log('内容:', content)
// }

// 注意: 如果不指定编码，返回 Buffer，可用 toString('utf-8')转换

// ============================================================
// 5 场景5: 复制文件
// ============================================================
console.log('\n=== 场景5: 复制文件 ===')

const copyFile = path.join(baseDir, 'demo_copy.txt')

// 同步方法
fs.copyFileSync(demoFile, copyFile)
console.log('已复制文件到:', copyFile)

// 异步 Promise 版本
// async function copyFileAsync() {
//     await fs.promises.copyFile(demoFile, copyFile)
// }

// 小文件也可以用 read + write
// const data = fs.readFileSync(demoFile)
// fs.writeFileSync(copyFile, data)

// ============================================================
// 6 场景6: 流式写入和读取(大文件如视频/音频/图片)
// ============================================================
console.log('\n=== 场景6: 流式读写(大文件复制) ===')

// 6.1 流式写入
const streamWriteFile = path.join(baseDir, 'stream_demo.txt')
const ws = fs.createWriteStream(streamWriteFile, 'utf-8')
ws.write('流式写入第一行\n')
ws.write('流式写入第二行\n')
ws.write('流式写入第三行\n')
ws.end()  // 标记写入结束
console.log('流式写入完成:', streamWriteFile)

// 6.2 流式读取
console.log('流式读取内容:')
fs.createReadStream(streamWriteFile, 'utf-8')
    .on('data', chunk => console.log('[chunk]', chunk))
    .on('end', () => console.log('流式读取完成'))

// 6.3 使用 pipe 复制文件(最常用)
const srcVideo = path.join(__dirname, 'video.mp4')
const destVideo = path.join(baseDir, 'video_copy.mp4')

// 创建测试用的大文件(模拟)
// fs.writeFileSync(srcVideo, '模拟视频文件内容'.repeat(1000))

// pipe 方式复制(推荐，自动管理背压)
if (fs.existsSync(srcVideo)) {
    const wsPipe = fs.createWriteStream(destVideo)
    fs.createReadStream(srcVideo).pipe(wsPipe)
    wsPipe.on('finish', () => {
        console.log('pipe 方式复制video完成')

        // 6.4 移动文件到新文件夹
        const videoDir = path.join(baseDir, 'video')
        fs.mkdirSync(videoDir, { recursive: true })
        const movedVideo = path.join(videoDir, 'video_copy.mp4')
        fs.renameSync(destVideo, movedVideo)
        console.log('移动文件到:', movedVideo)
    })
}

// 6.4 手动流式复制(需要手动处理背压)
const destManual = destVideo.replace('.mp4', '_manual.mp4')
if (fs.existsSync(srcVideo)) {
    const rs = fs.createReadStream(srcVideo)
    const ws2 = fs.createWriteStream(destManual)

    rs.on('data', chunk => {
        const canContinue = ws2.write(chunk)
        if (!canContinue) {
            rs.pause()  // 背压处理：写入缓冲区满时暂停读取
            ws2.once('drain', () => rs.resume())  // 缓冲区清空时恢复
        }
    })
    rs.on('end', () => ws2.end())
    console.log('手动流式复制video完成')
}

// ============================================================
// 7 场景7: 查看文件夹内容
// ============================================================
console.log('\n=== 场景7: 查看文件夹内容 ===')

// 同步方法 - 仅返回名称数组
const files = fs.readdirSync(baseDir)
console.log('文件夹内容:', files)

// 含详细信息的版本
console.log('\n详细信息:')
fs.readdirSync(baseDir, { withFileTypes: true }).forEach(item => {
    const type = item.isDirectory() ? '[DIR]' : '[FILE]'
    const name = item.name
    console.log(`  ${type} ${name}`)
})

// 异步 Promise 版本
// async function listDir() {
//     const files = await fs.promises.readdir(baseDir)
//     console.log(files)
// }

// ============================================================
// 8 场景8: 子文件夹操作 - 创建/复制/重命名
// ============================================================
console.log('\n=== 场景8: 子文件夹批量操作 ===')

const subDir = path.join(baseDir, 'subFolder')

// 8.1 创建子文件夹
fs.mkdirSync(subDir, { recursive: true })
console.log('已创建子文件夹:', subDir)

// 8.2 批量复制文件到子文件夹
console.log('\n批量复制 demo 开头的文件:')
files.forEach(file => {
    if (file.startsWith('demo')) {
        const src = path.join(baseDir, file)
        const dest = path.join(subDir, file)
        fs.copyFileSync(src, dest)
        console.log(`  复制: ${file} -> subFolder/`)
    }
})

// 8.3 批量重命名(在子文件夹中)
console.log('\n批量重命名 subFolder 中的文件:')
const subFiles = fs.readdirSync(subDir)
subFiles.forEach(file => {
    if (file.startsWith('demo')) {
        const oldPath = path.join(subDir, file)
        const newPath = path.join(subDir, `new_${file}`)
        fs.renameSync(oldPath, newPath)
        console.log(`  重命名: ${file} -> new_${file}`)
    }
})

// ============================================================
// 9 附录: fs 方法对照表
// ============================================================
console.log('\n=== 附录: fs 方法速查表 ===')
console.log(`
| 同步方法          | Promise 版本           | 用途               |
|-------------------|------------------------|--------------------|
| existsSync        | fs.promises.access     | 检查存在性         |
| mkdirSync         | fs.promises.mkdir      | 创建文件夹         |
| writeFileSync     | fs.promises.writeFile  | 写入文件           |
| appendFileSync    | fs.promises.appendFile | 追加写入           |
| readFileSync      | fs.promises.readFile   | 读取文件           |
| unlinkSync        | fs.promises.unlink     | 删除文件           |
| copyFileSync      | fs.promises.copyFile   | 复制文件           |
| readdirSync       | fs.promises.readdir    | 读取文件夹         |
| renameSync        | fs.promises.rename     | 重命名/移动        |
| rmdirSync         | fs.promises.rmdir      | 删除文件夹         |
| createReadStream  | -                      | 流式读取           |
| createWriteStream | -                      | 流式写入           |
`)

// ============================================================
// 10 清理演示文件夹(可选)
// ============================================================
// fs.rmSync(baseDir, { recursive: true, force: true })
// console.log('\n已清理演示文件夹')
