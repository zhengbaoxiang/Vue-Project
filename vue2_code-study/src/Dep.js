// 收集依赖
class Dep{
    constructor(){
        this.subs = [] // 存储与当前dep有关联的watcher
    }
    addSub (){
       
    }
    removeSub(){}
    // 将当前dep 与 watcher关联
    depend(){}

    notify(){
        // 真实vue中，依次触发subs里的watcher 中的 update方法
        if(Dep.target){
            Dep.target.update()
        }
    }
}

// 全局的容器存储渲染Watcher
Dep.target = null