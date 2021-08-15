import React, { useEffect, useState, useRef, useReducer, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux'

import {changePlayTime, changePlayInfo, changePlayList, changePlayIndex} from '@/store/player/action';
import {changeErrorShow} from '@/store/app/action.js'
import {getSongUrl} from '@/utils/songUtil.js'
import {getTopSong} from '@/api/songsApi.js'
import {formateTimeToMmSs} from '@/utils/timeUtil.js'

import './Songs.scss'

let relation = [
    {type: 0,name: '全部'},
    {type: 7,name: '华语'},
    {type: 96,name: '欧美'},
    {type: 8,name: '日本'},
    {type: 16,name: '韩国'},  
]

export default function Songs(props) {

    const dispatch = useDispatch()
    const player = useSelector(state => state.playerReducer)

    const [index, setIndex] = useState(0)
    const [data, setData] = useState({})

    const changeIndex = (index) => {
        return () => {
            setIndex(index)
            let params = {type: relation[index].type}
            if(!data[3]) {
                getTopSong(params).then(res => {
                    if(res.code === 200) {
                        res.data.forEach(item => {
                            item.dt = item.duration
                            item.url = getSongUrl(item.id)
                            item.al = item.album
                        })
                        
                        setData((prev) => {return {...prev,[index]: res.data}})
                    }else {
                        dispatch(changeErrorShow({isShow: true, message: res.code}))
                    }
                })
            }
        }
    }

    const playSong = (i) => {
        return () => {
            dispatch(changePlayList(data[index]))
            dispatch(changePlayInfo(data[index][i]))
            const audio = document.querySelector('#audio')
            audio.currentTime = 0
            dispatch(changePlayTime(0))
            dispatch(changePlayIndex(i))
        }
    }

    useEffect(() => {
        let params = {type: relation[0].type}
        getTopSong(params).then(res => {
            if(res.code === 200) {
                res.data.forEach(item => {
                    item.dt = item.duration
                    item.url = getSongUrl(item.id)
                    item.al = item.album
                })
                setData((prev) => {return {...prev,0: res.data}})
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
    }, [])

    return (
        <div className="Songs">
            <ul className="areas">
                {
                    relation.map((item, i) => {
                        return (
                            <li onClick={changeIndex(i)} className={`area ${index === i ? 'active' : '' }`} key={item.type} >
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>   
            <ul className="songs">
                {
                    data[index] ? 
                        data[index].map((song, i) => (
                            <li 
                                className={`song-item ${song.id === player?.playInfo?.id ? 'active' : '' }`} 
                                key={song.id}
                                onClick={playSong(i)}>
                                <i className="iconfont icon-yinliang volumn" style={{display: song.id === player?.playInfo?.id ? 'block' : 'none'}}></i>
                                <span className="index" style={{display: song.id !== player?.playInfo?.id ? 'block' : 'none'}}>{i+1}</span>
                                <div className="song-img">
                                    <img src={song.al.picUrl}/>
                                </div>
                                <span className="song-title">
                                    {song.name}
                                </span>
                                <span className="song-singer">
                                    {(song.al.artists || []).map(item => item.name).join('/')}
                                </span>
                                <span className="song-album">
                                    {song.al.name}
                                </span>
                                <span className="song-duration">
                                    {formateTimeToMmSs(song.dt)}
                                </span>
                            </li>
                        ))
                    : ''
                }    
            </ul>  
            {
                ((!data[index] || data[index].length===0)  ? (
                    <div className="no-data">
                        暂无数据
                    </div>
                ) : '')
            }      
        </div>
    )
}