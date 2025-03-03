// 数据响应化方法
// // 优化4  vue2 针对数组的几种方法，也变成响应式，需要扩展函数功能
// push pop shift unshift reverse splice  sort
let Array_Method = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'splice',
    'sort'
]
// 修改继承的原型链结构，不改变Array原型的方法
let arrPrototype = Object.create(Array.prototype)
Array_Method.forEach((method) => {
    arrPrototype[method] = function () {
        console.log('->', '数组拦截了', '<')
        // 调用原来的方法
        let res = Array.prototype[method].apply(this, arguments)
        // 新功能,可以监听到数组改变了，将改变的参数，也进行响应化处理
        for (let i = 0; i < arguments.length; i++) {
            observe(arguments[i],null) // 需要vm,此时拿不到
        }
        return res
    }
})

// 将对象变成响应式的
function observe(o, vm) {
    // 直接根据类型处理
    if (Array.isArray(o)) {
        o.__proto__ = arrPrototype

        // 实际上，vue2并未对数组索引，以及数组元素做响应式处理，此处添加遍历方法，可以理解为对$set的一种实现
        for (let i = 0; i < o.length; i++) {  
            defineReactive.call(vm, o, i, o[i]) // 数组索引访问，设为响应式
            // observe(o[i], vm) // 递归数组元素 
        }
        
    } else if (typeof o === 'object' && o !== null) {
        let keys = Object.keys(o)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = o[key]
            defineReactive.call(vm, o, key, value) // 对象的每个属性访问，设置响应式
            observe(value, vm)  // 递归对象的元素
        }
    }else{
        console.log('值类型，无需响应式>',o,'<');
    }
}
function defineReactive(target, key, value) {
    const that = this

    const dep = new Dep() 
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get() {
            console.log('->触发get- key：value |',key, value)
            dep.depend()  // p14 收 集依赖
            return value
        },
        set(newVal) {
            console.log('->触发set',key, newVal, '<')
            //  实际vue2 没实现重新赋值的，也变成响应式的，只有$Set时实现了
            if (typeof newVal === 'object' && newVal != null) {
                defineReactive.call(that, target, key, newVal) // 新对象的属性增加响应式
                observe(newVal, that)  // 新对象增加响应式
            }
            value = newVal

            // 触发模板刷新 (模仿watcher） 用实例 vm 执行 mountComponent
            // that&&that.mountComponent()

            // 派发更新 p14
            dep.notify()
        }
    })
}

JgVue.prototype.initData = function () {
    //遍历data成员，转为响应式，
    observe(this._data, this)

    let keys = Object.keys(this._data)
    // 同时做代理将data属性挂到实例上
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        // 1 代理
        // Object.defineProperty(this,key,{
        //     enumerable:true,
        //     configurable:true,
        //     get(){
        //         return this._data[key]
        //     },
        //     set(newVal){
        //         this._data[key] = newVal
        //     }
        // })
        // 2  封装
        proxy(this, '_data', key)
        // 类似的还有methods, props,computed等各自成员都要映射，因此封装proxy
    }
}

// 访问一个对象的属性时拦截，返回另一个对象的值，做个代理
function proxy(target, prop, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
            return target[prop][key]
        },
        set(newVal) {
            target[prop][key] = newVal
        }
    })
}
