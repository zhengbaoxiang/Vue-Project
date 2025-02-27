/*
 * @Date: 2021-10-09 09:35:16
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 11:19:10
 * @FilePath: \frontCode\src\libs\axios.js
 */
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/libs/util'
import config from '@/config'
const baseURL = config.baseUrl

const addErrorLog = errorInfo => {
    const {
        statusText,
        status,
        request: {
            responseURL
        }
    } = errorInfo
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    }
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
    constructor (baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig () {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                'token': getToken(),
            },
            withCredentials: true
        }
        return config
    }
    destroy (url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors (instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            // 添加全局的loading...
            if (!Object.keys(this.queue).length) {
                // Spin.show() // 不建议开启，因为界面不友好
            }
            this.queue[url] = true
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const {
                data,
                status,
                headers
            } = res
            return {
                data,
                status,
                headers
            }
        }, error => {
            this.destroy(url)
            let errorInfo = error.response
            if (!errorInfo) {
                const {
                    request: {
                        statusText,
                        status
                    },
                    config
                } = JSON.parse(JSON.stringify(error))
                errorInfo = {
                    statusText,
                    status,
                    request: {
                        responseURL: config.url
                    }
                }
            }
            addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }
    request (options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}

// export default HttpRequest

// 简化代码，合并api.request.js 到此处
const MyAxios = new HttpRequest(config.baseUrl)
export default MyAxios
