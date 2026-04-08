//ECMAscript 6 是最基础的规范 导出使用export/import

//CommonJS 是扩展后的，模块规范，编程API规范 使用module.exports，require
// require加载模块时，内容会全部执行一遍。并且缓存起来，只会执行一次


//1 module.exports向外暴露单一api , 可以是数字/字符串/函数/对象
// module.exports = add
// module.exports = 'add'
// module.exports = 18

//2 默认暴露对象{}，因此可以通过.name的形式，暴露多个用到的api
module.exports.name = '卫宫士郎'
module.exports.age = 18
module.exports.fate = {
    master:'卫宫士郎',
    servent:'Saber'
}
module.exports.information = function(x,y){
    //this指向暴露的那个对象api
    console.log(this.name,this.age)
    console.log(this.fate,this.fate.servent)
    return '人活着就是为了Saber'
}

//3 module.exports 与 exports
// require返回的是module.exports最终指向的那个对象，
//如果对象唯一，则与exports效果一致，否则exports设置的属性都会失效
//建议始终使用module.exports
exports.ex1 = 1233;
exports.ex2 = 'ssss'
exports.show = function(){
    console.log(this.ex1,this.ex2)
}

//   这行会覆盖前面的module.exports指向,
// module.exports = '我会重新定义新的对象空间，前面全部失效'


// 4 常见的用法1- 封装函数或者一个类
module.exports = function (req,res){
    // 扩展功能
    req.query = 123
    res.render = function(){}
}
// 其他文件引用这个文件,作为一个函数使用
// const myModule = require('./selfModule.js')
// myModule(req,res)

// 常见用法2 - 返回一个对象，可以具有多个api
module.exports = {
    name:'自定义模块',
    handler:function(){
        // 处理逻辑
        return 123
    },
    getDetail:function(arg){
        return this.name + this.handler() 
    }
}
// 其他文件引用这个文件，作为一个对象使用
// const myModule = require('./selfModule.js')
// myModule.getDetail('4566')









