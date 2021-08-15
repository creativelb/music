import React, { useEffect, useState,useRef ,useReducer, useMemo} from "react";
import {useSelector,useDispatch} from 'react-redux'

import {changePlayTime, changePlayInfo, changePlayList, changePlayIndex} from '@/store/player/action';
import {getSearch} from '@/api/searchApi.js'
import {changeErrorShow} from '@/store/app/action.js'
import {GetUrlParam} from '@/utils/stringUtil.js'
import {getSongUrl} from '@/utils/songUtil.js'
import {formateTimeToMmSs} from '@/utils/timeUtil.js'

import './Search.scss'

const relation = {
    0: 1,
    1: 1000
}

export default function Search(props) {

    const dispatch = useDispatch()
    const player = useSelector(state => state.playerReducer)

    const [search, setSearch] = useState('')
    const [index, setIndex] = useState(0)
    const [data, setData] = useState({})

    useEffect(() => {
        const {search} = GetUrlParam(props.location.search) 
        setSearch(search)
        getSearchResult(0, search)

        let hashchange = (e) => {
            let newURL = decodeURI(e.newURL)
            let start = newURL.indexOf('?' )
            let value = newURL.substring(start)
            const {search} = GetUrlParam(value)
            console.log(search);
            setSearch(search)
            
            getSearchResult(index, search) 
        }
        window.addEventListener('hashchange', hashchange) 
        return () => {
            window.removeEventListener('hashchange', hashchange)
        }
    }, [])

    const getSearchResult = (i, keywords) => {
        if(!keywords) keywords = search
        if(data[i] && data[i].length > 0) return 
        let type = relation[i]
        let params = {keywords:keywords, type: type, limit: 50, offset: 1}
        getSearch(params).then(res => {
            if(res.code === 200) {
                if(i === 0) {
                    res.result.songs.forEach(item => {
                        item.dt = item.duration
                        item.url = getSongUrl(item.id)
                        item.album.picUrl = item.artists[0].img1v1Url
                        item.al = item.album
                    });
                    setData(prev =>{return {...prev, [i]: res.result.songs}})
                }else {
                    setData(prev =>{return {...prev, [i]: res.result.playlists}})
                }
                
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
    }

    const changeIndex = (i) => {
        return () => {
            setIndex(i)
            getSearchResult(i)
        }
    }

    const playSong = (i) => {
        return () => {
            dispatch(changePlayList(data[0]))
            dispatch(changePlayInfo(data[0][i]))
            document.querySelector('audio').currentTime = 0
            dispatch(changePlayTime(0))
        }
    }

    const goPlaylist = (playlist) => {
        return () => {
            const id = playlist.id
            const url = `/home/main/playlist?id=${id}`
            props.history.push(url)
        }
    }

    return (
        <div className="Search">
            <div className="info">
                <span className="search-content">"{search}"</span>
                <span className="count">共找到{data[index] ? data[index].length : 0}条结果</span>
            </div>
            <ul className="categorys">
                <li onClick={changeIndex(0)} className={`category ${index === 0 ? 'active' : '' }`}>单曲</li>
                <li onClick={changeIndex(1)} className={`category ${index === 1 ? 'active' : '' }`}>歌单</li>
            </ul>
            {
                index === 0 && data[0] && data[0].length > 0? (
                    <ul>
                        {
                            data[0].map((song, i) => {
                                return (
                                    <li 
                                        className={`song-item ${song.id === player?.playInfo?.id ? 'active' : '' }`} 
                                        key={song.id}
                                        onClick={playSong(i)}>
                                        <i className="iconfont icon-yinliang volumn" style={{display: song.id === player?.playInfo?.id ? 'block' : 'none'}}></i>
                                        <span className="index" style={{display: song.id !== player?.playInfo?.id ? 'block' : 'none'}}>{index+1}</span>
                                        <span className="song-title">
                                            {song.name}
                                        </span>
                                        <span className="song-singer">
                                            {(song.artists || []).map(item => item.name).join('/')}
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
                ) : ''
            }
            {
                index === 1 && data[1] && data[1].length > 0? (
                    <ul className="playlists">
                        {
                            data[index] && data[index].length > 0 ? 
                                data[index].map((playlist, i) => (
                                    <li onClick={goPlaylist(playlist)} className="playlist-item" key={playlist.id}>
                                        <div className="img">
                                            <img src={playlist.coverImgUrl}/>
                                        </div>
                                        <div className="name">{playlist.name}</div>
                                    </li>
                                ))
                            : ''
                        }   
                    </ul>
                ) : ''
            }
            {
                ((!data[index] || data[index].length===0) ? (
                    <div className="no-data">
                        暂无数据
                    </div>
                ) : '')
            } 
        </div>
    )
}