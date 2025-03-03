/*
 * @Date: 2023-07-29 09:35:25
 * @LastEditors: zbx
 * @LastEditTime: 2023-07-29 11:19:01
 * @descript: 文件描述
 */


JgVue.prototype.mount = function (){
    // 提供一个render方法，生成虚拟DOM (vue本身在options里可以带有render，此处简化处理)
    this.render = this.createRenderFn()

    this.mountComponent()
}

JgVue.prototype.mountComponent = function(){
    let mount = ()=>{
        this.update( this.render() )
    }
    // p14 初始增加定义的 全局Watcher，任何地方都能访问，从而更新。是一种简化写法
    Dep.target = new Watcher(this,mount)

    // mount.call(this)
    // 为什么不直接这么写？ 
    // 因为 使用发布订阅模式，渲染和计算应该交给watcher来调用，但是没讲到这里
    // this.update(this.render())
    
}
// 这里生成render函数，目的是缓存 抽烟语法树 此处使用虚拟dom 模拟
JgVue.prototype.createRenderFn = function (){

    let ast = getVNode(this._template)
    console.log('->', ast,'<');
    

    // Vue 将ast + data => data 
    // 我们将带有坑的VNode + data => 有数据的VNode
    return function render (){
        return combine(ast,this._data)
    };

};
// 将虚拟DOM渲染到页面中;diff算法在这里
JgVue.prototype.update = function (vnode){
    // 简化处理，就是直接把虚拟dom转为dom，然后替换
    let realDom = parseVNode(vnode)
    // 原生的替换方法是:首参数替换第二参数位置，跟字符串反着
    this._parent.replaceChild(realDom,document.querySelector(this._el)) //每次重新获取
};
