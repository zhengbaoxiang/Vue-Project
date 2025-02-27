/*
 * @Date: 2022-04-18 13:41:52
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 16:38:22
 * @FilePath: \front\src\api\test.js
 */
import request from '@/libs/request'

export const testApi = {
    getList: data => {
        return request({
            url: `/nodeApi/test/getList`,
            data,
            method: 'post'
        });
    },
    add: data => {
        return request({
            url: `/nodeApi/test/add`,
            data,
            method: 'post'
        });
    },
    update: data => {
        return request({
            url: `/nodeApi/test/update`,
            data,
            method: 'post'
        });
    },

    delete: params => {
        return request({
            url: `/nodeApi/test/delete`,
            params,
            method: 'get'
        });
    },
    getDetail: params => {
        return request({
            url: `/nodeApi/test/getDetail`,
            params,
            method: 'get'
        });
    },
    uploadFile: data => {
        return request({
            url: `/nodeApi/test/uploadFile`,
            data,
            method: 'post',
        });
    },
    getFile: params => {
        return request({
            url: `/nodeApi/test/getFile`,
            params,
            method: 'get',
            // responseType: 'blob'
            // responseType: 'arrarybuffer'
        });
    },
    getFilelist: params => {
        return request({
            url: `/nodeApi/test/getFilelist`,
            params,
            method: 'get',
        });
    },

}






