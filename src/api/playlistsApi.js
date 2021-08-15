import {request} from '@/api/index.js'

export function getCatlists() {
    return request({
        url: '/playlist/catlist',
        method: 'get'
    })
}

export function getPlaylist(params) {
    return request({
        url: '/top/playlist',
        method: 'get',
        params
    })
}