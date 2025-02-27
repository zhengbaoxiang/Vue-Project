// 观察者
class Watcher{
    /**
     * 
     * @param {*} vm  实例
     * @param {*} expOrfn  渲染函数或路径表达式
     */
    constructor(vm,expOrfn){
        this.vm = vm
        this.getter = expOrfn

        this.deps = []
        this.depIds ={}

        this.get()
    }

    get(){
        pushTarget(this)
        this.getter.call(this.vm,this.vm)
        popTarget()
    }
    run(){
     this.get()  
    }
    update(){
        this.run()
    }
    // 清空依赖队列
    cleanupDep(){
        
    }
}