/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 14:37:00
 * @FilePath: \management\src\components\main\components\route-menu\mixin.js
 */
import CommonIcon from '_c/common-icon'
import { showTitle } from '@/libs/util'
export default {
    components: {
        CommonIcon
    },
    methods: {
        showTitle(item) {
            return showTitle(item, this)
        },
        showChildren(item) {
            return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
        },
        getNameOrHref(item) {
            // 有链接就返回链接地址，没有链接就判断是否只有一个子路由
            if (item.href) {
                return `isTurnByHref_${item.href}`
            } else if (item.children && item.children.length === 1) {
                return item.children[0].name
            } else {
                return item.name
            }
        },
        getCurrentItem(item) {
            if (item.children && item.children.length === 1) {
                return item.children[0]
            } else {
                return item
            }
        }
    }
}
