
function JgVue(options){
    this._data = options.data
    this._el = options.el
    this._template = document.querySelector(options.el)
    this._parent = this._template.parentNode

    // 将对象变成响应式
    // reactfity(options.data)
    
    // 优化上边原来的方法
    this.initData(this._data)

    this.mount() //挂载
}