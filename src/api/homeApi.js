import {request} from '@/api/index.js'

// 获取热词
export function getHotSearchList() {
    return request({
        url: '/search/hot',
        method: 'get'
    })
}

// 获取搜索结果
export function getSearchSuggest(params) {
    return request({
        url: '/search/suggest',
        method: 'get',
        params
    })
}