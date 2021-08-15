import {songUrlPrefix} from '@/config/songConfig.js'

export const getSongUrl = (songId) => {
    return songUrlPrefix + songId + '.mp3'
}