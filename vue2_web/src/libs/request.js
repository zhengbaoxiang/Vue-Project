/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-22 13:21:21
 * @FilePath: \management\src\libs\request.js
 */
import axios from '@/libs/axios'
import { getToken } from '@/libs/util'
import config from '@/config'
import store from '@/store'
import { Modal, Message } from 'view-design'

const request = opts => {
    return new Promise((resolve, reject) => {
        axios.request(opts).then(res => {
            if (res.data && res.data.code) {
                if (res.data.code == 510) {
                    let token = getToken();
                    // Message.error(res.data.message )

                    Modal.info({
                        title: '提示',
                        content: `${res.data.message}`,
                        okText: '重新登录',
                        onOk: () => {
                            store.commit('setToken', '');
                            store.commit('userInfo', '');

                            // sso获取ticket
                            window.location.href = config.loginUrl

                            // 账密登录
                            // window.location.pathname = `${config.publicPath}/login`

                            // cas登出·
                            // var url = `${config.authHost}/cas/logoutV2?authServiceId=${config.authServiceId}&token=${token}`;
                            // window.location.href = url;
                        }
                    });
                    reject(res.data);
                } else if (res.data.code === 200 || res.data.code === '000') {
                    resolve(res.data);
                } else {
                    Message.error(res.data.msg || '接口异常')
                    reject(res.data);
                }
            } else {
                // 兼容导出
                resolve(res);
            }
        }).catch(error => {
            console.log(error)
            // Message.error('未知异常')
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
                code: '999',
                msg: opts.msg || '请求失败，请重试',
                data: error
            });
        });
    });
}
export default request
