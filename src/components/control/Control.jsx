import React, { useEffect, useState,useRef ,useReducer, useMemo} from "react";
import {useSelector,useDispatch} from 'react-redux'
import ProgressBar from "@/components/progressbar/ProgressBar.jsx";
import {formateTimeToMmSs} from '@/utils/timeUtil.js'
import { changeVolumn, changePlayInfo, changePlayIndex, changePlayTime, changeOrder, changePlayState} from '@/store/player/action';

import './Control.scss'


export default function Control(props) {
    
    const dispatch = useDispatch()
    const player = useSelector(state => state.playerReducer)
    const hasSong = useMemo(() => player.playInfo && Object.keys(player.playInfo).length>0, player.playerInfo)
    const author = useMemo(() => player.playInfo.ar ? player.playInfo.ar.map(item => item.name).join('/') : '')
    
    const changeSong = (index) => {
        return () => {
            if(!hasSong) return
            let playIndex = (player.playIndex + index) % player.playList.length
            let playInfo = player.playList[playIndex]
            dispatch(changePlayInfo(playInfo))
            dispatch(changePlayIndex(playIndex))
            dispatch(changePlayTime(0))
            document.querySelector('audio').currentTime = 0
            // document.querySelector('audio').play()
        }
    }
    const changeState = () => {
        if(!hasSong) return
        let playState = !player.playState
        dispatch(changePlayState(playState))
        let audio = document.querySelector('#audio')
        playState ? audio.play() : audio.pause()
    }

    const changePlayOrder = () => {
        let order = (player.order + 1) % 3
        dispatch(changeOrder(order))
    }

    const changePlayVolumn = (volumn) => {
        dispatch(changeVolumn(volumn))
        document.querySelector('audio').volume = volumn
    }

    return (
        <div className="Control">
            <div className="left" style={{visibility: hasSong ? 'visible' : 'hidden'}}>
                <div className="img">
                    <img src={player.playInfo.al ? player.playInfo.al.picUrl : ''}/>
                </div>
                <div className="info">
                    <p><span className="name">{player.playInfo.name}</span><span className="author">&nbsp;&nbsp;-&nbsp;&nbsp;{author}</span></p>
                    <p className="time">{formateTimeToMmSs(player.playTime*1000)}&nbsp;/&nbsp;{formateTimeToMmSs(player.playInfo.dt)}</p>
                    
                </div>
            </div>
            <div className="center">
                <i className="iconfont icon-diyiyeshouyeshangyishou" onClick={changeSong(-1)}></i>
                <i className={`iconfont ${player.playState ? 'icon-zanting' : 'icon-ziyuan'}`} onClick={changeState}></i>
                <i className="iconfont icon-zuihouyiyemoyexiayishou" onClick={changeSong(1)}></i>
            </div>
            <div className="right">
                <i className="iconfont icon-shunxubofang" onClick={changePlayOrder} style={{display:player.order === 0 ? 'block' : 'none'}}></i>
                <i className="iconfont icon-hanhan-01-01" onClick={changePlayOrder} style={{display:player.order === 1 ? 'block' : 'none'}}></i>
                <i className="iconfont icon-suijibofang" onClick={changePlayOrder} style={{display:player.order === 2 ? 'block' : 'none'}}></i>
                <i className="iconfont icon-yinliang"></i>
                <div className="progress-bar">
                    <ProgressBar height={'2px'} alwaysDot={true} percent={player.volumn} percentChange={changePlayVolumn}></ProgressBar>
                </div>
                <a href="https://github.com/creativelb">
                    <i className="iconfont icon-github"></i>
                </a>
                
            </div>
        </div>
    )
}