import {request} from '@/api/index.js'

export function getSongDetail(params) {
    return request({
        url: '/song/detail',
        method: 'get',
        params
    })
}