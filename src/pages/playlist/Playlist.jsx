import React, { useEffect, useState,useRef ,useReducer, useMemo} from "react";
import {useSelector,useDispatch} from 'react-redux'

import {changePlayTime, changePlayInfo, changePlayList, changePlayIndex, changePlayState} from '@/store/player/action';
import {changeErrorShow} from '@/store/app/action.js'
import {getPlaylistDetail} from '@/api/playlistApi.js'
import {GetUrlParam} from '@/utils/stringUtil.js';
import {getSongUrl} from '@/utils/songUtil.js'
import {formateTimeToMmSs} from '@/utils/timeUtil.js'

import './Playlist.scss'

export default function Playlist(props) {
    
    const dispatch = useDispatch()
    const player = useSelector(state => state.playerReducer)

    const [id, setId] = useState()  
    const [playlist, setPlaylist] = useState({})
    const [songs, setSongs] = useState([])


    const playAll = () => {
        if(!songs || songs.length === 0) return 
        dispatch(changePlayList(songs))
        dispatch(changePlayInfo(songs[0]))
        const audio = document.querySelector('#audio')
        audio.currentTime = 0
        dispatch(changePlayTime(0))
        dispatch(changePlayIndex(0))
        // debugger
        // audio.play()
        // dispatch(changePlayState(true))
    }

    const playSong = (index) => {
        return () => {
            dispatch(changePlayList(songs))
            dispatch(changePlayInfo(songs[index]))
            const audio = document.querySelector('#audio')
            audio.currentTime = 0
            dispatch(changePlayTime(0))
            dispatch(changePlayIndex(index))
        }
    }

    useEffect(() => {
        const {id} = GetUrlParam(props.location.search)
        setId(id)
        let params = {id: id}
        getPlaylistDetail(params).then(res => {
            if(res.code === 200) {
                setPlaylist(res.playlist)
                let songs = res.playlist.tracks.map(item => {
                    item.url = getSongUrl(item.id)
                    return item
                })
                setSongs(songs)
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
    }, [])

    return (
        <div className="Playlist">
            <div className="info">
                <div className="cover">
                    <img src={playlist.coverImgUrl}/>
                </div>
                <div className="content">
                    <h4 className="title">{playlist.name}</h4>
                    <div className="author">
                        <div className="avatar">
                            <img src={playlist?.creator?.avatarUrl} alt="" />
                        </div>
                        <span className="name">{playlist?.creator?.nickname}</span>
                        <span className="time">{(new Date(parseInt(playlist.createTime))).toLocaleDateString()}</span>
                    </div>
                    <div className="button" onClick={playAll}>
                        <i className="iconfont icon-ziyuan"></i>播放全部
                    </div>
                    <p className="tags">标签:&nbsp;{playlist?.tags?.join('/')}</p>
                    {
                        playlist?.description ? (
                            <p className="description">简介:&nbsp;{playlist?.description.substring(0, 50) + '...'}</p>
                        ) : ''
                    }
                </div>
            </div>
            <ul className="songs">
                {
                    songs.map((song, index) => {
                        return (
                            <li 
                                className={`song-item ${song.id === player?.playInfo?.id ? 'active' : '' }`} 
                                key={song.id}
                                onClick={playSong(index)}>
                                <i className="iconfont icon-yinliang volumn" style={{display: song.id === player?.playInfo?.id ? 'block' : 'none'}}></i>
                                <span className="index" style={{display: song.id !== player?.playInfo?.id ? 'block' : 'none'}}>{index+1}</span>
                                <div className="song-img">
                                    <img src={song.al.picUrl}/>
                                </div>
                                <span className="song-title">
                                    {song.name}
                                </span>
                                <span className="song-singer">
                                    {(song.ar || []).map(item => item.name).join('/')}
                                </span>
                                <span className="song-album">
                                    {song.al.name}
                                </span>
                                <span className="song-duration">
                                    {formateTimeToMmSs(song.dt)}
                                </span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}