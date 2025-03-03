/*
 * @Date: 2022-02-08 14:21:10
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 14:32:40
 * @FilePath: \management\src\mock\login.js
 */
import { getUrlParams } from '@/libs/util'
const USER_MAP = {

    zbx: {
        token: 'zbx',
        userId: 'zbx',
        realname: 'zheng',
        roleCode: 'admin',
        roleName: '管理员',
    },
    youke: {
        token: 'youke',
        userId: 'youke',
        realname: '游客名',
        roleCode: 'user',
        roleName: '普通用户',
    },
}

export const login = req => {
    req = JSON.parse(req.body)
    return {
        token: USER_MAP[req.username].token,
        userInfo: USER_MAP[req.username]
    }
}

export const getUserInfo = req => {
    const params = getUrlParams(req.url)
    console.log('->',req.url,params)
    return USER_MAP[params.token]
}

export const logout = req => {
    return null
}
