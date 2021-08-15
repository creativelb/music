import {request} from '@/api/index.js'

export function getTopSong(params) {
    return request({
        url: '/top/song',
        method: 'get',
        params
    })
}
