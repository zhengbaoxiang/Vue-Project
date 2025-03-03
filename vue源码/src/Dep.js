/*
 * @Date: 2023-07-29 09:35:25
 * @LastEditors: zbx
 * @LastEditTime: 2023-07-29 14:33:45
 * @descript: 文件描述
 */
// 提供收集依赖 和 派发更新的功能
class Dep{
    constructor(){
        this.subs = [] // 存储与当前dep有关联的watcher
    }
    addSub (sub){
       this.subs.push(sub)
    }
    removeSub(sub){
        remove(this.subs,sub)
    }
    // 收集依赖 将当前dep 与 watcher关联
    depend(){
        console.log('-收集的依赖 target 是什么？>',Dep.target)
        if(Dep.target){
            this.addSub(Dep.target)
        }
    }

    // 派发更新
    notify(){
        // 全部更新
        // if(Dep.target){
        //     Dep.target.update()
        // }
        // 真实vue中，依次触发subs里的watcher 中的 update方法，是局部更新
        const subs = this.subs.slice()
        subs.forEach(sub=>{
            sub.update()
        })


    }
}
function remove(arr,item,d){
    if(arr.length){
        const idx = arr.indexOf(item)
        if(idx>-1){
            return arr.splice(idx,1)
        }
    }
}

// 全局的容器存储渲染Watcher,使用全局watcher的话，无法实现局部更新
Dep.target = null

let targetStack = [] // 模拟全局栈

// 将当前操作的 watcher 存储到全局的watcher中 参数target 就是当前 watcher
function pushTarget(target) {
    targetStack.unshift(target) // 源码使用push()
    Dep.target = target
}

// 踢出当前watcher，到最后就是undefined
function popTarget (){
    Dep.target = targetStack.shift() // 源码使用pop()
}

//  在watcher 调用get方法的时候，调用 pushTarget(this)
//  在get方法结束的时候，调用popTarget()