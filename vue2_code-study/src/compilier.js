
    

    /**
     * 使用递归，遍历dom元素 ，生成虚拟dom;
     * vue 源码使用 栈结构，利用栈存储，父元素，实现递归生成
     */
    function getVNode(node) {
        let nodeType = node.nodeType
        let _vnode = null
        if (nodeType === 1) {
            //元素 ,将属性数组转为对象
            let attrs = node.attributes;
            // nodeType = 2为属性节点
            let _attrObj = {}
            for (let i = 0; i < attrs.length; i++) {
                _attrObj[attrs[i].nodeName] = attrs[i].nodeValue
            }

            _vnode = new VNode(node.nodeName, _attrObj, undefined, nodeType)

            // 考虑子元素
            let childNodes = node.childNodes  // 包含标签之间回车换行的文本节点
            for (let i = 0; i < childNodes.length; i++) {
                let child = getVNode(childNodes[i])
                _vnode.appendChild(child)
            }
        } else if (nodeType === 3) {
            // 文本节点，tag为undefined,属性无，值就是文本，类型为3
            _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
        }

        return _vnode
    }

    // 将虚拟dom,转换为真实DOM
    function parseVNode(vnode) {
        let nodeType = vnode.type
        let _node = null
        if (nodeType === 1) {
            // 创建元素节点，标签，属性，以及子元素
            _node = document.createElement(vnode.tag)

            // 将对象属性，添加到元素上
            let data = vnode.data
            Object.keys(data).forEach(key => {
                let attrName = key;
                let attrValue = data[key]
                _node.setAttribute(attrName, attrValue)
            })

            // 子元素节点
            let children = vnode.children
            for (let i = 0; i < children.length; i++) {
                let child = parseVNode(children[i])
                _node.appendChild(child)
            }
        } else if (nodeType === 3) { // 创建文本节点，只需要value
            _node = document.createTextNode(vnode.value)
        }

        return _node
    }

     // 05根据对象，及 路径'xx.yy.zz'，获取属性值
     function getValueByPath(obj,path){
        let paths = path.split( '.' ) // [xx,yy,zz]

        let res = obj  ; 
        let key ;
        // 使用循环或者数组遍历均可
        while ( key = paths.shift() ) { 
            res = res[key] //读取不到，报错也是正常的，无需兼容 a.b.c.d
        }
        return res
    }

    // 将vNode与数据结合，进行填充,生成新的vnode 模拟ast -> VNode
    function combine(vnode,data){
        let rkuohao = /\{\{(.+?)\}\}/g  // 括号转义 .+匹配任意字符，?取消贪婪 全局匹配，小括号分组
        let _type = vnode.type
        let _data = vnode.data
        let _value = vnode.value
        let _tag = vnode.tag
        let _children = vnode.children

        let _vnode = null
        if(_type === 3){
            _value = _value.replace(rkuohao,function (_,g){
                let key = g.trim()
                let value = getValueByPath(data,key)
                return value
            })
            _vnode = new VNode(_tag,_data,_value,_type)

        }else if(_type === 1){
            _vnode = new VNode(_tag,_data,_value,_type)
            _children.forEach(_subVnode=>{
                _vnode.appendChild( combine(_subVnode,data) )
            })
        }

        return _vnode
    };
