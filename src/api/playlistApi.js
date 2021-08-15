import {request} from '@/api/index.js'

// 获取歌单
export function getPlaylistDetail(params) {
    return request({
        url: '/playlist/detail',
        method: 'get',
        params
    })
}