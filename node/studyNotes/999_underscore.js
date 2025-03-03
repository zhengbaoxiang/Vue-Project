// 工具介绍 可不看
const _ = require('underscore')

//zip方法
var names = ['宫园薰', '香香', '新垣结衣']
var ages = ['14', '18', '28']
var sexs = ['少女', '少妇', '小姐姐']

var resultzip = _.zip(names, ages, sexs)
// console.log(resultzip)
//拆分压缩 [[ '宫园薰', '14', '少女' ],[ '香香', '18', '少妇' ], [ '新垣结衣', '28', '小姐姐' ]]
// 解压
let resultUnzip = _.unzip(resultzip)
// [ (['宫园薰', '香香', '新垣结衣'], ['14', '18', '28'], ['少女', '少妇', '小姐姐']) ]

//模板template()
//创建模板代码文档
var tmp = '<h2><%= name %></h2>'

//代入template()函数中，返回一个函数
var fn = _.template(tmp)

//数据对象，传入相应的参数,返回构造好的html字符串
var html = fn({ name: '新垣结衣' })

console.log(html)
