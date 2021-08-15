import React, { useEffect, useState, useRef, useReducer, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux'
import Swiper from "swiper"

import { changeVolumn, changePlayTime, changePlayInfo, changePlayList, changePlayIndex, changePlayState} from '@/store/player/action';
import {getBanner ,getPlaylists, getNewSong} from '@/api/discoverApi'
import {changeErrorShow} from '@/store/app/action.js'
import {getSongUrl} from '@/utils/songUtil.js'

import "swiper/swiper.scss"
import "./Discover.scss"

export default function Discover(props) {

    const dispatch = useDispatch()
    const player = useSelector(state => state.playerReducer)
    const [swiper, setSwiper] = useState({})
    const [banners, setBanners] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [songs, setSongs] = useState([])

    const getAuthor = (authorArr) => {
        return authorArr.map(item => item.name).join('/')
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

    const goPlaylist = (item) => {
        return () => {
            const id = item.id
            const url = '/home/main/playlist?id=' + id
            props.history.push(url)
        }
    }

    useEffect(() => {
        getBanner().then(res => {
            if(res.code === 200) {
                setBanners(res.banners) 
                let swiper = new Swiper('.swiper-container', {
                    speed: 500,
                    loop: true,
                    width: 800,
                    height: 200,
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction:false
                    },
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true,//修改swiper的父元素时，自动初始化swiper
                })
                setSwiper(swiper)
                window.sw = swiper
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
        let params = {limit: 10}
        getPlaylists(params).then(res => {
            if(res.code === 200) {
                setPlaylists(res.result)
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
        params = {limit: 10}
        getNewSong(params).then(res => {
            if(res.code === 200) {
                res.result.map(item => {
                    item.url = getSongUrl(item.id)
                    item.dt = item.song.duration
                    item.al = {
                        picUrl: item.picUrl
                    } 
                    return item
                })
                setSongs(res.result)
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
    }, [])

    return (
        <div className="Discover">
            {/* <div className="banner">
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {
                            banners.map(banner => {
                                return (
                                    <div className="img" key={banner.id}>
                                        <img src={banner.imageUrl} />
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                </div>
            </div> */}
            <h4>推荐歌单</h4>
            <div className="recommend-playlists">
                {
                    playlists.map(playlist => {
                        return (
                            <div className="playlist-item" key={playlist.id} onClick={goPlaylist(playlist)}>
                                <div className="img">
                                    <img src={playlist.picUrl} alt="" />
                                </div>
                                <div className="name">{playlist.name}</div>
                            </div>
                        )
                    })
                }
            </div>
            <h4>最新音乐</h4>
            <div className="new-songs">
                {
                    songs.map((song, index) => {
                        return (
                            <div className="song-item" key={song.id} onClick={playSong(index)}>
                                <span className="index">{ index+1 }</span>
                                <div className="img">
                                    <img src={song.picUrl} alt="" />
                                </div>
                                <div className="song-info">
                                    <p className="name">{song.name}</p>
                                    <p className="author">{getAuthor(song.song.artists)}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}