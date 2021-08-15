import React, { useEffect, useState,useRef ,useReducer, useMemo} from "react";
import {useSelector,useDispatch} from 'react-redux'

import {getCatlists, getPlaylist} from '@/api/playlistsApi.js'
import {changeErrorShow} from '@/store/app/action.js'

import './Playlists.scss'

export default function Playlists(props) {

    const dispatch = useDispatch()
    const player = useSelector(state => state.playerReducer)

    const [cats, setCats] = useState([])
    const [index, setIndex] = useState(0)
    const [data, setData] = useState({})

    const changeIndex = (i) => {
        return () => {
            setIndex(i)
            playlist(i)
        }
    }

    const goPlaylist = (playlist) => {
        return () => {
            const id = playlist.id
            const url = `/home/main/playlist?id=${id}`
            props.history.push(url)
        }
    }

    const playlist = (i) => {
        if(data[i] && data[i].length > 0) return 
        const cat = cats[i]?.name || '全部'
        let params = {limit: 20, cat: cat, offset: 0}
        console.log(params);
        getPlaylist(params).then(res => {
            if(res.code === 200) {
                setData(prev => {return {...prev, [i]: res.playlists}})
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        })
    }

    const catlists = () => {
        getCatlists().then(res => {
            if(res.code === 200) {
                let catlists = res.sub.slice(0, 10)
                catlists.unshift({name: '全部'})
                setCats(catlists)
            }else {
                dispatch(changeErrorShow({isShow: true, message: res.code}))
            }
        }) 
    }

    useEffect(() => {
        catlists()
        playlist(0)
    }, [])

    return (
        <div className="Playlists">
            <ul className="cats">
                {
                    cats.map((item, i) => {
                        return (
                            <li onClick={changeIndex(i)}  className={`cat ${index === i ? 'active' : '' }`} key={item.name} >
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul> 
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