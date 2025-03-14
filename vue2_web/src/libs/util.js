import Cookies from 'js-cookie'
import { forEach, objEqual } from '@/libs/tools'
// cookie保存的天数
import config from '@/config'
const { title, cookieExpires, useI18n } = config

const urlReg = new RegExp('([\?]token=([A-z0-9%]+))', 'i')
const accountRule = /^[A-Za-z0-9_]{3,20}$/
// 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：
//   ^[a-zA-Z]\w{5,17}$
// 强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 8-10 之间)：
//  ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$
// 强密码(必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间)：
//   ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}
export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}

export const setLocal = (k, v) => {
    localStorage.setItem(k, JSON.stringify(v))
}
export const getLocal = (k) => {
    return (localStorage.getItem(k) && JSON.parse(localStorage.getItem(k))) || ''
}

export const setSession = (k, v) => {
    sessionStorage.setItem(k, JSON.stringify(v))
}
export const getSession = (k) => {
    return (sessionStorage.getItem(k) && JSON.parse(localStorage.getItem(k))) || ''
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值位数只有1位，则在前面补充0
 */

export const formatDate = (date, type = 'date') => {
    if (!date) {
        return null
    }
    let d = new Date(date);
    let year = d.getFullYear();
    let month = addZero(d.getMonth() + 1);
    let day = addZero(d.getDate());
    let hour = addZero(d.getHours());
    let minutes = addZero(d.getMinutes());
    let seconds = addZero(d.getSeconds());

    // 日期
    if (type === 'date') {
        return `${year}-${month}-${day}`;
        // 日期+时间
    } else if (type === 'dateTime') {
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    } else if (type === 'millisecond') {
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}.000`;
        // 月份
    } else if (type === 'month') {
        return `${year}-${month}`
        // 年份
    } else if (type === 'year') {
        return year;
    }
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType = null) => {
    const d = new Date(timeStamp * 1000)
    const year = d.getFullYear()
    const month = addZero(d.getMonth() + 1)
    const date = addZero(d.getDate())
    const hours = addZero(d.getHours())
    const minutes = addZero(d.getMinutes())
    const second = addZero(d.getSeconds())
    let resStr = ''
    if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
    else resStr = month + '-' + date + ' ' + hours + ':' + minutes
    return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
    // 判断当前传入的时间戳是秒格式还是毫秒
    const IS_MILLISECOND = isMillisecond(timeStamp)
    // 如果是毫秒格式则转为秒格式
    if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
    // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
    timeStamp = Number(timeStamp)
    // 获取当前时间时间戳
    const currentTime = Math.floor(Date.parse(new Date()) / 1000)
    // 判断传入时间戳是否早于当前时间戳
    const IS_EARLY = isEarly(timeStamp, currentTime)
    // 获取两个时间戳差值
    let diff = currentTime - timeStamp
    // 如果IS_EARLY为false则差值取反
    if (!IS_EARLY) diff = -diff
    let resStr = ''
    const dirStr = IS_EARLY ? '前' : '后'
    // 少于等于59秒
    if (diff <= 59) resStr = diff + '秒' + dirStr
    // 多于59秒，少于等于59分钟59秒
    else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
    // 多于59分钟59秒，少于等于23小时59分钟59秒
    else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
    // 多于23小时59分钟59秒，少于等于29天59分钟59秒
    else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
    // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
    else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
    else resStr = getDate(timeStamp, 'year')
    return resStr
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getUrlParams = url => {
    if (url.indexOf('?') === -1) return {}

    const keyValueArr = url.split('?')[1].split('&')
    let paramObj = {}
    keyValueArr.forEach(item => {
        const keyValue = item.split('=')
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
}
export const getUrlToken = url => {
    let token = ''
    const urlReg = new RegExp('([\?]token=([A-z0-9%]+))', 'i');

    // 1 match方法
    const match = urlReg.exec(url)
    console.log('-match->', match, '<-');
    if (match) {
        token = match[2];
    }
    // 2 test 方法
    if (urlReg.test(url)) {
        token = RegExp.$2
    }
    return token
}

// 复制文本到剪贴板
export const copyText = (text) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', text);
    input.select();

    try {
        document.execCommand('copy');
        console.log('复制成功');
    } catch (e) {
        console.log('-->', e, '<-');
    }
    document.body.removeChild(input);
}

// html 截取为图片
// import html2canvas from "html2canvas";
export const convertToImage = (container, options = {}) => {
    try {
        // 设置放大倍数
        const scale = window.devicePixelRatio;
        // 配置图片宽高
        const width = options.width || container.offsetWidth;
        const height = options.height || container.offsetHeight;
        // html2canvas配置项
        const ops = {
            scale,
            width,
            height,
            useCORS: true,
            allowTaint: false,
            ...options
        };
        // // 需要时打开
        // return html2canvas(container, ops).then((canvas) => {
        //     // 返回图片的二进制数据
        //     return canvas.toDataURL("image/png");
        // });
    } catch (error) {
        console.log('->', error, '<');
    }
};

// canvasList 合并导出为pdf
// import {jsPDF} from "jspdf";
export function exportPdf(name, canvasList) {
    let pdf = new jsPDF('', 'pt', 'a4');
    // 当前页面的当前高度
    let currentPos = 0;
    for (let canvas of canvasList) {
        if (canvas) {

            let contentWidth = canvas.width;
            let contentHeight = canvas.height;

            //a4纸的尺寸[595.28,841.89]
            let a4Width = 592.28;
            let a4Height = 841.89;

            // html页面生成的canvas在pdf中图片的宽高
            let imgWidth = a4Width;
            let imgHeight = a4Width / contentWidth * contentHeight;

            let pageData = canvas.toDataURL('image/jpeg', 1.0);

            // 当前图片的剩余高度
            let imgLeftHeight = imgHeight;

            // 当前页面的剩余高度
            let blankHeight = a4Height - currentPos;

            // zbx fnew
            if (imgLeftHeight <= blankHeight) {
                pdf.addImage(pageData, 'JPEG', 0, currentPos, imgWidth, imgHeight);
                currentPos += imgHeight;
            } else {
                // 剩余高度小于200，直接用新页面
                if (blankHeight < 200) {
                    pdf.addPage();
                    currentPos = 0;
                }
                //页面偏移
                let yPosition = 0;
                while (imgLeftHeight > 0) {
                    // 本次添加占用的高度
                    let occupation = a4Height - currentPos;
                    pdf.addImage(pageData, 'JPEG', 0, yPosition + currentPos, imgWidth, imgHeight);

                    //判断是否添加空白页
                    if (imgLeftHeight - occupation > 0) {
                        pdf.addPage();
                        currentPos = 0;
                        yPosition -= occupation;
                    } else {
                        currentPos = imgLeftHeight;
                    }
                    imgLeftHeight = imgLeftHeight - occupation;

                }
            }
        }
    }

    pdf.save(name.replace(" ", "_") + '.pdf');

}
// window打印
export function windowPrint(id, zoom) {
    //根据div标签ID拿到div中的局部内容
    let bdhtml = window.document.body.innerHTML;
    let el = document.getElementById(id);
    var jubuData = el.innerHTML;
    document.getElementsByTagName('body')[0].style.zoom = zoom;
    //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容
    window.document.body.innerHTML = jubuData;
    //调用打印功能
    window.print();
    document.getElementsByTagName('body')[0].style.zoom = 1;
    window.document.body.innerHTML = bdhtml;//重新给页面内容赋值；
    return false;
}

//将base64转换为blob对象 解决低版本浏览器兼容问题
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(',');
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var mime = arr[0].match(/:(.*?);/)[1]
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

//将blob转换成file
function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export const hasChild = (item) => {
    return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.access && item.meta.access.length) {
        if (hasOneOf(item.meta.access, access)) return true
        else return false
    } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    let res = []
    forEach(list, item => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            let obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta
            }
            if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
                obj.children = getMenuByRouter(item.children, access)
            }
            if (item.meta && item.meta.href) obj.href = item.meta.href
            if (showThisMenuEle(item, access)) res.push(obj)
        }
    })
    return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
    let routeMetched = route.matched
    if (routeMetched.some(item => item.name === homeRoute.name)) return [{ ...homeRoute, icon: homeRoute.meta.icon }]
    let res = routeMetched.filter(item => {
        return item.meta === undefined || !item.meta.hideInBread
    }).map(item => {
        let meta = { ...item.meta }
        if (meta.title && typeof meta.title === 'function') {
            meta.__titleIsFunction__ = true
            meta.title = meta.title(route)
        }
        let obj = {
            icon: (item.meta && item.meta.icon) || '',
            name: item.name,
            meta: meta
        }
        return obj
    })
    res = res.filter(item => {
        return !item.meta.hideInMenu
    })
    // 适配没有home路由时的面包屑
    if (homeRoute.name) {
        let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
        return [{ ...homeItem, to: homeRoute.path }, ...res]
    } else {
        return [...res]
    }
}

export const getRouteTitleHandled = (route) => {
    let router = { ...route }
    let meta = { ...route.meta }
    let title = ''
    if (meta.title) {
        if (typeof meta.title === 'function') {
            meta.__titleIsFunction__ = true
            title = meta.title(router)
        } else title = meta.title
    }
    meta.title = title
    router.meta = meta
    return router
}

export const showTitle = (item, vm) => {
    let { title, __titleIsFunction__ } = item.meta
    if (!title) return
    if (useI18n) {
        if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
        else if (__titleIsFunction__) title = item.meta.title
        else title = vm.$t(item.name)
    } else title = (item.meta && item.meta.title) || item.name
    return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
    localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList
    return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
    let i = -1
    let len = routers.length
    let homeRoute = {}
    while (++i < len) {
        let item = routers[i]
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children, homeName)
            if (res.name) return res
        } else {
            if (item.name === homeName) homeRoute = item
        }
    }
    return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const { name, path, meta } = newRoute
    let newList = [...list]
    if (newList.findIndex(item => item.name === name) >= 0) return newList
    else newList.push({ name, path, meta })
    return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
    if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
    else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
    const routePermissionJudge = (list) => {
        return list.some(item => {
            if (item.children && item.children.length) {
                return routePermissionJudge(item.children)
            } else if (item.name === name) {
                return hasAccess(access, item)
            }
        })
    }

    return routePermissionJudge(routes)
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {}
    if (list.length === 2) {
        res = getHomeRoute(list)
    } else {
        const index = list.findIndex(item => routeEqual(item, route))
        if (index === list.length - 1) res = list[list.length - 2]
        else res = list[index + 1]
    }
    return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
    let i = -1
    while (++i < times) {
        callback(i)
    }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
    let nameSplit = file.name.split('.')
    let format = nameSplit[nameSplit.length - 1]
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsText(file) // 以文本格式读取
        let arr = []
        reader.onload = function (evt) {
            let data = evt.target.result // 读到的数据
            let pasteData = data.trim()
            arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
                return row.split('\t')
            }).map(item => {
                return item[0].split(',')
            })
            if (format === 'csv') resolve(arr)
            else reject(new Error('[Format Error]:你上传的不是Csv文件'))
        }
    })
}



/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
    let columns = []
    let tableData = []
    if (array.length > 1) {
        let titles = array.shift()
        columns = titles.map(item => {
            return {
                title: item,
                key: item
            }
        })
        tableData = array.map(item => {
            let res = {}
            item.forEach((col, i) => {
                res[titles[i]] = col
            })
            return res
        })
    }
    return {
        columns,
        tableData
    }
}

export const findNodeUpper = (ele, tag) => {
    if (ele.parentNode) {
        if (ele.parentNode.tagName === tag.toUpperCase()) {
            return ele.parentNode
        } else {
            return findNodeUpper(ele.parentNode, tag)
        }
    }
}

export const findNodeUpperByClasses = (ele, classes) => {
    let parentNode = ele.parentNode
    if (parentNode) {
        let classList = parentNode.classList
        if (classList && classes.every(className => classList.contains(className))) {
            return parentNode
        } else {
            return findNodeUpperByClasses(parentNode, classes)
        }
    }
}

export const findNodeDownward = (ele, tag) => {
    const tagName = tag.toUpperCase()
    if (ele.childNodes.length) {
        let i = -1
        let len = ele.childNodes.length
        while (++i < len) {
            let child = ele.childNodes[i]
            if (child.tagName === tagName) return child
            else return findNodeDownward(child, tag)
        }
    }
}

export const showByAccess = (access, canViewAccess) => {
    return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {}
    const params2 = route2.params || {}
    const query1 = route1.query || {}
    const query2 = route2.query || {}
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
    let len = tagNavList.length
    let res = false
    doCustomTimes(len, (index) => {
        if (routeEqual(tagNavList[index], routeItem)) res = true
    })
    return res
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60)
            }
        )
    }
    const difference = Math.abs(from - to)
    const step = Math.ceil(difference / duration * 50)

    const scroll = (start, end, step) => {
        if (start === end) {
            endCallback && endCallback()
            return
        }

        let d = (start + step > end) ? end : start + step
        if (start > end) {
            d = (start - step < end) ? end : start - step
        }

        if (el === window) {
            window.scrollTo(d, d)
        } else {
            el.scrollTop = d
        }
        window.requestAnimationFrame(() => scroll(d, end, step))
    }
    scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
    const handledRoute = getRouteTitleHandled(routeItem)
    const pageTitle = showTitle(handledRoute, vm)
    const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
    window.document.title = resTitle
}

export const DateFormat = (date, fmt = 'yyyy-MM-DD') => {
    if (!date) {
        return null
    }
    let d = new Date(date);
    let o = {
        'M+': d.getMonth() + 1, // 月份
        'd+': d.getDate(), // 日
        'h+': d.getHours(), // 小时
        'm+': d.getMinutes(), // 分
        's+': d.getSeconds(), // 秒
        'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
        'S': d.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}

// 处理权限
export const dealAuth = ({
    auth = {},
    access = [],
    menuList = []
}) => {
    menuList.forEach(item => {
        access.push(item.alias);
        if (item.children && item.children.length) {
            let obj = dealAuth({
                auth: {},
                access,
                menuList: item.children
            });
            access = obj.access;
            auth[item.alias] = obj.auth;
        } else {
            auth[item.alias] = true;
        }
    });
    return { auth, access };
}

/**
js默认算法0.1+0.2=0.30000000000000004，使用下边算法结果等于0.3
* 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
*
* @param num1加数1 | num2加数2
*/
export const numAdd = (num1, num2) => {
    let baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
};
/**
* 加法运算，避免数据相减小数点后产生多位数和计算精度损失。
*
* @param num1被减数 | num2减数
*/
export const numSub = (num1, num2) => {
    let baseNum, baseNum1, baseNum2;
    // let precision; // 精度
    try {
        baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    // precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    // return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    return ((num1 * baseNum - num2 * baseNum) / baseNum);
};
/**
* 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
*
* @param num1被乘数 | num2乘数
*/
export const numMulti = (num1, num2) => {
    let baseNum = 0;
    try {
        baseNum += num1.toString().split('.')[1].length;
    } catch (e) {
    }
    try {
        baseNum += num2.toString().split('.')[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
};
/**
* 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
*
* @param num1被除数 | num2除数
*/
export const numDiv = (num1, num2) => {
    let baseNum1 = 0, baseNum2 = 0;
    let baseNum3, baseNum4;
    try {
        baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum3 = Number(num1.toString().replace('.', ''));
    baseNum4 = Number(num2.toString().replace('.', ''));
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
};

// 格式化金额
export const formatterPrize = (num, precision = 2) => {
    // 删除为空
    if (num === null || num === '' || num === undefined) {
        return num;
    }
    // 先提取整数部分
    num = num.toFixed(precision);
    var res = num.toString().replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ',';
        });
    })
    return res;
};
// 金额转回数字
export const parserPrize = (num, precision = 2) => {
    // 删除为空
    if (num === null || num === '' || num === undefined) {
        return num;
    }
    let res = num.replace(/,/g, '');
    res = parseFloat(res).toFixed(precision);
    return res;
}

/**
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
    return targetarr.some(_ => arr.indexOf(_) > -1)
}
/**
 * @param {*} routeItem 路由
 * @param {*} access    用户权限数组，如 ['super_admin', 'admin']
 */

export const hasPermission = (routeItem, access) => {
    if (routeItem.meta && routeItem.meta.access && routeItem.meta.access.length) {
        return hasOneOf(access, routeItem.meta.access)
    }
    else return true
}

/**
 * @param {Array} routes 路由列表,
 * @param {Array} access 用户权限数组，如 ['super_admin', 'admin']
 */
export const getMenuByRoutes = (routes, access) => {
    let res = []
    routes.forEach((item) => {
        item.meta = item.meta || {}
        if (!item.meta.hideInMenu && hasPermission(item, access)) {
            let obj = {
                name: item.name,
                meta: item.meta,
                icon: item.meta.icon || '',
                href: item.meta.href || null
            }
            if (hasChild(item)) {
                obj.children = getMenuByRoutes(item.children, access)
            }
            res.push(obj)
        }
    })
    return res
}








/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
    const keyValueArr = url.split('?')[1].split('&')
    let paramObj = {}
    keyValueArr.forEach(item => {
        const keyValue = item.split('=')
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
}









export const localSave = (key, value) => {
    localStorage.setItem(key, value)
}

export const localRead = (key) => {
    return localStorage.getItem(key) || ''
}



// 获取用户信息

export const getUserInfo = () => {
    return getLocal("userInfo");
};
// 设置用户信息

export const setUserInfo = val => {
    setLocal("userInfo", val);
};


/*
** @param date [String][Number] 时间 或 时间戳
** @param type [String] 类型 date:日期 dateTime: 日期+时间 month: 'yyyy-mm
*/
// 格式化时间
function addZero(n, len = 2) {
    n = n.toString();
    while (n.length < len) {
        n = '0' + n
    }
    return n;
}


// 时间戳格式化为字符串 2023-04-15_00_00
export const timeToStr = (time) => {
    return formatDate(time, 'urlDate')
};
// 字符串 2023-04-15_00_00 转换为时间戳
export const strToDate = (str) => {
    if (!str) return null
    let arr = str.split('_')
    let timeStr = `${arr[0]} ${arr[1]}:${arr[2]}:${arr[3]}`
    const date = new Date(timeStr)
    return date
};

/*
** list结构转map结构
** @param list [Array] 待转换数组
** @param keyName [String] list转map所需的key值
*/
export const listToMap = (list, keyName) => {
    let hashMap = {};
    for (let i = 0; i < list.length; i++) {
        let key = list[i][keyName];
        hashMap[key] = list[i];
    }
    return hashMap;
}


export const getQueryStr = query => {
    let url = ''
    if (query) {
        let queryArr = [];
        for (const key in query) {
            if (query.hasOwnProperty(key) && (query[key] || query[key] == 0)) {
                queryArr.push(`${key}=${query[key]}`)
            }
        }
        if (url.indexOf('?') !== -1) {
            url = `${url}&${queryArr.join('&')}`
        } else {
            url = `${url}?${queryArr.join('&')}`
        }
    }
    return url

}


// 将读取的二进制图片，转为base64 URl可直接赋值给src
export const blobToDataURL = (blob, callback) => {
    const reader = new FileReader()
    reader.onload = (event) => {
        // console.log('event', event)
        let base64Url = event.target.result
        // const base64Url = event.currentTarget.result
        // const base64Url = event.srcElement.result
        callback(base64Url)
    }
    reader.readAsDataURL(blob)
}

// 获取str中的参数并转换为map返回
export const getParamsMap = (str) => {
    let num
    let ret = new Map()
    var arr = str.split('&') // 各个参数放到数组里
    console.log(window.location.href)
    console.log(arr)
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=')
        console.log(arr[i].substring(0, num), arr[i].substr(num + 1))
        if (num > 0) {
            console.log(ret)
            ret.set(arr[i].substring(0, num), arr[i].substr(num + 1))
        }
    }
    return ret
}

const myReg = {
    /**
     * 手机号码校验
     */
    validatePhoneNumber: function(value) {
        return !!(
            value &&
            value.toString().length === 11 &&
            /^[1][3-9]\d{9}$/.test(value)
        )
    },
    /**
     * 手机号码校验，可为空
     */
    validatePhoneAllowEmpty: function(value) {
        return (
            !value ||
            !!(
                value &&
                value.toString().length === 11 &&
                /^[1][3-9]\d{9}$/.test(value)
            )
        )
    }
}
export default myReg

