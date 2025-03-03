/*
 * @Date: 2022-02-08 14:21:09
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 11:07:14
 * @FilePath: \frontCode\src\api\user.js
 */
import request from '@/libs/request'

// 登录
export const login = data => {
    return request({
        url: '/nodeApi/sys/login',
        data,
        method: 'post'
    })
}
// ticketLogin登录
export const ticketLogin = params => {
    return request({
        url: '/sys/ssoLogin',
        params,
        method: 'get'
    })
}

// 登出
export const logout = params => {
    return request({
        url: '/nodeApi/sys/logout',
        params,
        method: 'get'
    });
}

// 获取用户信息,鉴权接口
export const getUserAuth = params => {
    return request({
        url: '/nodeApi/sys/getUserAuth',
        params,
        method: 'get'
    })
}

// 修改密码
export const updatePassword = data => {
    return request({
        url: '/auth/updatePassword',
        data,
        method: 'post'
    });
}

// 获取图形验证码
export const getVcode = params => {
    return request({
        url: `/auth/captcha?t=${new Date().getTime()}`,
        params,
        method: 'get'
    });
}

// 获取验证码
export const getContextId = data => {
    return request({
        data,
        url: `/sign/gencontext`,
        method: 'post'
    })
}
// 发送验证码
export const sendSms = data => {
    return request({
        url: '/sign/sms/send',
        data,
        method: 'post'
    });
}
