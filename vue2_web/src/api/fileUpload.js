/*
 * @Descripttion: 附件相关
 * @version: 1.0.0
 * @Author: zbx
 * @Date: 2020-07-13 13:08:43
 * @LastEditors: zbx
 * @LastEditTime: 2022-02-21 14:13:17
 */ 
import request from '@/libs/request'

/*
** 附件上传相关api
*/ 
export const fileApi = {
    upLoadFile : data => {
        return request({
            url: `/file/upLoad`,
            data,
            method: 'post'
        });
    },
    deleteFile : params => {
        return request({
            url: `/file/delete`,
            params,
            method: 'get'
        });
    },
    getFile : params => {
        return request({
            url: `/file/get`,
            params,
            method: 'get',
            responseType: 'blob'
        });
    },
    
}






