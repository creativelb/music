import React, { useEffect, useState,useRef ,useReducer, useMemo} from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import Discover from "@/pages/discover/Discover";
import Search from '@/pages/search/Search.jsx'
import Playlists from "@/pages/playlists/Playlists";
import Songs from "@/pages/songs/Songs";
import Playlist from "@/pages/playlist/Playlist";
import './Main.scss'

export default function Main(props) {

    const isUrlMatch = (url) => {
        return props.location.pathname.indexOf(url) > -1
    }

    return (
        <div className="Main">
            <div className="sidebar">
                <ul>
                    <li 
                        onClick={() => {props.history.push('/home/main/discover')}} 
                        className={isUrlMatch('/home/main/discover') ? 'active' : ''}>
                        <i className="iconfont icon-yinle"></i>
                        <span>发现音乐</span>
                    </li>
                    <li 
                        onClick={() => {props.history.push('/home/main/playlists')}} 
                        className={isUrlMatch('/home/main/playlists') ? 'active' : ''}>
                            <i className="iconfont icon-gedan"></i>
                            <span>推荐歌单</span>
                    </li>
                    <li 
                        onClick={() => {props.history.push('/home/main/songs')}} 
                        className={isUrlMatch('/home/main/songs') ? 'active' : ''}>
                            <i className="iconfont icon-yinle1"></i>
                            <span>最新音乐</span>
                    </li>
                </ul>
            </div>
            <div className="content">
                <Switch>
                    <Route path="/home/main/discover" component={Discover}></Route>
                    <Route path="/home/main/playlists" component={Playlists}></Route>
                    <Route path="/home/main/songs" component={Songs}></Route>
                    <Route path="/home/main/playlist" component={Playlist}></Route>
                    <Route path="/home/main/search" component={Search}></Route>
                    <Route path="/home/main" exact render={
                        ()=> (
                            <Redirect to="/home/main/discover"/>)}>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}