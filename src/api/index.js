import axios from "axios";
import store from '@/store/index.js';
import {changeErrorShow} from '@/store/app/action.js'

import { url1, url2 } from '@/config/netConfig'

// url1: 线上环境
let url = url1
// URL2: 测试环境
// let url = url2

let instance1 = axios.create({
    baseURL: url,
    timeout: 5000
})

let {dispatch} = store
instance1.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if(response.status !== 200) {
        dispatch(changeErrorShow({isShow:true, message: response.status}))
    }
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export function request(config) {
    let method = !config.method ? 'get' : config.method
    let value = method.toLowerCase() === 'get' ? 'params' : 'data'

    console.log(`path:${config.url},method:${method},${value}:${config[value]}`)

    return instance1.request({
        url: config.url,
        [method]: method,
        [value]: config[value]
    })
}