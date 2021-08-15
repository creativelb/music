import {request} from '@/api/index.js'

// 搜索结果
export function getSearch (params) {
    return request({
        url: '/search',
        method: 'get',
        params
    })
}