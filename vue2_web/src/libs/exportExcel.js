/*
 * @Date: 2021-11-18 15:22:51
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 17:29:04
 * @FilePath: \front\src\libs\exportExcel.js
 */
/*
 * @Date: 2021-11-16 10:24:30
 * @LastEditors: zbx
 * @LastEditTime: 2021-11-17 10:15:14
 * @FilePath: \front\src\libs\exportExcel.js
 */
import Vue from 'vue'
import request from '@/libs/request'

const vm = new Vue()

// 导出excel方法合并,根据实际情况,get,post

// get: params ; const url =  `/tfamsapi/api/input/exportDataSource?companyCode=${data.companyCode}&accountPeriod=${data.period}&sceneCode=${data.sceneCode}`
export const getExcelFile = (url, params) => {
    request({
        url: url,
        params,
        method: 'get',
        responseType: 'blob'
    }).then(res => {
        console.log('get-request：', res.data);
        handleBLob(res)
    })
}

// post :data,
export const downloadExcelFile = (url, data) => {
    request({
        url: url,
        data,
        method: 'post',
        responseType: 'blob'
    }).then(res => {
        console.log('post-request：', res);
        handleBLob(res)
    })
}

export const handleBLob = (res) => {
    console.log("->", res);

    const tempStr = res.headers['content-disposition'] && res.headers['content-disposition'].split('=')[1] || ''
    const downloadName = decodeURIComponent(tempStr)
    console.log('downloadName:', downloadName);
    // if(!downloadName) return


    let blobFile = res.data
    // console.log('type:', typeof res.data);
    // console.log('type:', typeof res.data);
    // 其实res.data 本身应该是blob对象 ,// 但如果由于mock，导致不是blob,而是二进制数据流binary 就转换
    if (typeof blobFile !== 'object') {
        // 先利用 Buffer 将二进制字符串转为 Buffer 对象，再作为 Blob 的第一个参数
        const buf = Buffer.from(res.data, 'binary');
        
        blobFile = new Blob([buf],{
            type:"application/octet-stream"
        });
        console.log("->", blobFile);
    }

    let fileReader = new FileReader();
    fileReader.onload = function () {
        try {
            // 检查是否未普通json数据，后台转换失败给出的提示
            let jsonData = JSON.parse(this.result);
            console.log('jsonData', jsonData);
            if (jsonData.code) {
                vm.$Message.error(jsonData.msg);
                // // 去登录
                if (jsonData.code == '201') {
                    vm.$router.push({
                        path: '/login'
                    });
                }
            }
        } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            var downloadElement = document.createElement("a");
            var href = window.URL.createObjectURL(blobFile); //创建下载的链接
            downloadElement.href = href;
            // downloadElement.target = '_blank';
            downloadElement.download = downloadName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }
    };
    // 读取
    fileReader.readAsText(blobFile);

}

