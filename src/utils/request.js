/* 
工具函数层

*/
import axios from 'axios'
import qs from 'qs'
import local from './local'
import router from '../router/index'
// 引入elementui的弹窗
import {
    Message
} from 'element-ui'

// 设置请求服务器的地址 查看接口文档
axios.defaults.baseURL = 'http://127.0.0.1:5000'
axios.defaults.timeout = 5000;

// 请求拦截器
axios.interceptors.request.use((config) => {
    // 取出本地token
    let token = local.get('token')
    if (token) { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        config.headers.Authorization = token;
    }

    return config
})
// 响应拦截器  2个函数    网络请求成功的函数response 相反的err  use（里面2个函数）
axios.interceptors.response.use((response) => {
        // console.log(response.data);
        // 后台给的数据先拦下  对成功和失败的状态码统一判断
        if (response.data.code != undefined && response.data.msg != undefined) {
            let {
                code,
                msg
            } = response.data;
            if (code === 0) {
                Message({
                    type: 'success',
                    message: msg
                })
                // 失败时
            } else if (code === 1) {
                Message.error(msg)
            }
        }

        return response
    }, //这里还有个参数err 
    // 网络请求失败的情况
    err => {
        console.log('错误:', err);
        // err是个对象 有response和data 
        if (err.data.code != undefined && err.data.msg != undefined) {
            let {
                code,
                msg
            } = err.response.data
            if (code === 401) {
                Message.error(msg)
                local.clear()
                // 错误处理
                router.push('/login')
            }
        }
    }
)

export default {
    get(url, data = {}) {
        return new Promise((res, rej) => {
            axios.get(url, {
                    params: data
                })
                .then(response => {
                    res(response.data)
                })
                .catch(err => {
                    rej(err)
                })
        })
    },
    post(url, data = {}) {
        return new Promise((res, rej) => {
            axios.post(url, qs.stringify(data))
                .then(response => {
                    res(response.data)
                })
                .catch(err => {
                    rej(err)
                })
        })
    }


}