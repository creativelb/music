import {request} from '@/api/index.js'

export function getBanner() {
    return request({
        url: '/banner',
        method: 'get'
    })
}

export function getPlaylists(params) {
    return request({
        url: '/personalized',
        method: 'get',
        params
    })
}

export function getNewSong(params) {
    return request({
        url: '/personalized/newsong',
        method: 'get',
        params
    })
}