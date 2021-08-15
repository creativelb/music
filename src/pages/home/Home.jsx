import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import Main from '@/pages/main/Main.jsx'
import Control from '@/components/control/Control';
import ProgressBar from '@/components/progressbar/ProgressBar';
import ErrorShow from '@/components/errorshow/ErrorShow';
import { connect } from 'react-redux';
import { changeVolumn, changePlayTime, changePlayInfo, changePlayList, changePlayIndex, changePlayState} from '@/store/player/action';
import {changeErrorShow} from '@/store/app/action.js'
import {getItem, setItem} from '@/storage/index.js'
import {getHotSearchList, getSearchSuggest} from '@/api/homeApi.js'
import {getSongDetail} from '@/api/commonApi.js'
import {getSongUrl} from '@/utils/songUtil.js'
import {randomNum} from '@/utils/mathUtil.js'
import './Home.scss'

class Home extends Component {

    state = {
        audio: {},
        searchShow: false,
        hotSearch: [],
        historySearch: [],
        search: '',
        isDefaultSearch: true,
        searchSuggest: {},
        percent: 0
    }

    // 前进后退
    go = (direction) => {
        return (e) => {
            this.props.history.go(direction)
        }
    }
    // 输入改变
    searchChange = (e) => {
        let value = e.target.value
        this.setState({search: value})
        if(value.length === 0) {
            this.setState({isDefaultSearch: true})
        }else {
            this.setState({isDefaultSearch: false})
            let params = {
                keywords: value
            }
            getSearchSuggest(params).then(res => {
                if(res.code === 200) {
                    let searchSuggest = {songs: res.result.songs || [], playlists: res.result.playlists || []}
                    let rep = `<span class='highlight'>${value}</span>`
                    searchSuggest.songs.forEach(item => {
                        item._fullname = item.name.replaceAll(value, rep)
                    })
                    searchSuggest.playlists.forEach(item => {
                        item._fullname = item.name.replaceAll(value, rep)
                    })
                    this.setState({searchSuggest: searchSuggest})
                }
            })
        } 
    }
    // 点击搜索
    searchFn = (content) => {
        return () => {
            console.log(content);
            this.state.historySearch.unshift(content)
            if(this.state.historySearch.length > 10) {
                this.state.historySearch.pop()
            }
            this.setState({historySearch: this.state.historySearch})
            setItem('historySearch', this.state.historySearch)
            // 跳转页面 
            let url = `/home/main/search?search=${content}`
            this.props.history.push(url)
            // 关闭侧边栏
            this.setState(this.setState({searchShow: false}))
        }
    }
    // 点击搜索结果
    searchResultClick = (type, item) => {
        return () => {
            if(type === 'song') {
                let params = {ids: item.id}
                getSongDetail(params).then(res => {
                    if(res.code === 200) {
                        console.log(res);
                        if(!res.songs || !res.songs[0]) {
                            this.props.setErrorShow({isShow: true, message: '没有此歌曲'})
                        }
                        res.songs[0].url = getSongUrl(res.songs[0].id)
                        this.props.setPlayInfo(res.songs[0])
                        this.props.setPlayList([res.songs[0]])
                        this.props.setPlayState(true)
                    }else {
                        this.props.setErrorShow({isShow: true, message: res.code})
                    }
                })
            }else {
                console.log('playlists');
                console.log(item);
                let id = item.id
                this.props.history.push({
                    pathname: '/home/main/playlist',
                    params: {
                        id: id
                    }
                })
                this.props.history.push(`/home/main/playlist?id=${id}`)
            }
            this.state.historySearch.unshift(item.name)
            if(this.state.historySearch.length > 10) {
                this.state.historySearch.pop()
            }
            this.setState({historySearch: this.state.historySearch})
            // 关闭侧边栏
            this.setState(this.setState({searchShow: false}))
        }
    }
    onReady = () => {
        console.log('ready');
        let audio = document.getElementById('audio')
        // audio.currentTime = 0
        setTimeout(() => {
            audio.play()
        }, 30);
        this.props.setPlayState(true)
        // audio.play()
        // dispatch(changePlayState(true))
    }
    onError = (e) => {
        if(this.props.player.playList.length !==1) {
            this.props.setErrorShow({isShow: true, message: '播放失败,切换到一首歌'})
            let index = this.props.player.playIndex + 1
            let playInfo = this.props.player.playList[index]
            this.props.setPlayIndex(index)
            this.props.setPlayInfo(playInfo)
            document.querySelector('#audio').currentTime = 0
        }else {
            this.props.setErrorShow({isShow: true, message: '播放失败'})
        }
    }
    // 时间发生变化
    timeUpdate = (e) => {
        let audio = document.getElementById('audio')
        let currentTime = audio.currentTime
        this.props.setPlayTime(currentTime)
        let percent = currentTime / (this.props.player.playInfo.dt / 1000)
        this.setState({percent: percent})
    }
    // 歌曲播放完成
    ended = () => {
        let audio = document.getElementById('audio')
        let order = this.props.player.order
        let playIndex = 0
        if(order === 0) { // 列表
            playIndex = (this.props.player.playIndex + 1) % this.props.player.playList.length
        }else if(order === 2){ // 随机
            playIndex = randomNum(0, this.props.player.playList.length - 1)
        }
        this.props.setPlayIndex(playIndex)
        this.props.setPlayInfo(this.props.player.playList[playIndex])
        audio.currentTime = 0
        // audio.play()
    }
    // 进度条改变
    percentChange = (percent) => {
        this.setState({percent: percent})
        let playTime = parseInt(this.props.player.playInfo.dt / 1000 * percent)
        this.props.setPlayTime(playTime)
        this.setState({audio: {...this.state.audio, currenTime: playTime}})
        // ref和state中无法获取真实audio对象 是虚拟dom对象 暂不知道如何解决
        document.getElementById('audio').currentTime = playTime
    }
    // 页面更新
    // componentDidUpdate(prevProps, prevState) {
        // 播放信息改变 说明切歌了  就设置自动播放
        // if(prevProps.player.playInfo !== this.props.player.playInfo) {
        //     this.props.setPlayTime(0)
        //     this.props.setPlayState(true)
        //     document.getElementById('audio').currentTime = 0
        //     document.getElementById('audio').play()
        // }
    // }
    // mounted
    componentDidMount() {
        // 设置audio
        let audio = document.querySelector('#audio')
        this.setState({audio: audio})

        // 获取搜索历史
        let historySearch = getItem('historySearch') || []
        this.setState({historySearch: historySearch}) 
        // 获取热词
        getHotSearchList().then(res => {
            console.log(res);
            if(res.code !== 200) {
                this.props.setErrorShow({isShow:true, message: res.code})
                return
            }
            this.setState({hotSearch: res.result.hots})
        })
    }

    render() {
        return (
            <div className="Home">
                <div className="top-bar">
                    <div className="arrow">
                        <i className="iconfont icon-left" onClick={this.go(-1)}></i>
                        <i className="iconfont icon-right" onClick={this.go(1)}></i>
                    </div>
                    <div className="search">
                        <i className="iconfont icon-search"></i>
                        <input type="text" placeholder="搜索" 
                            value={this.state.search}  
                            onChange={this.searchChange}
                            onFocus={() => this.setState({searchShow: true})}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <Switch>
                        <Route path="/home/main" component={Main}></Route>
                        <Route path="/home/" exact render={
                            ()=> (
                                <Redirect to="/home/main"/>)}>
                        </Route>
                        <Route path="/home/*" exact render={
                            ()=> (
                                <Redirect to="/404"/>)}>
                        </Route>
                    </Switch>
                </div>
                <div className="bottom">
                    <div className="progress-bar-wrapper" style={{visibility: !this.props.player.playInfo || Object.keys(this.props.player.playInfo).length === 0 ? 'hidden' : 'visible' }} >
                        <ProgressBar percent={this.state.percent} height={'2px'} alwaysDot={true} percentChange={this.percentChange}></ProgressBar>
                    </div>
                    <Control></Control>
                </div>
                <div className="search-box" style={{display: this.state.searchShow ? 'block' : 'none'}}>
                    {this.state.isDefaultSearch ? 
                        (
                            <div className="default-search-box">
                                <h4>热门搜索</h4>
                                <ul>
                                    {
                                        this.state.hotSearch.map(item => {
                                            return <li key={item.first} onClick={this.searchFn(item.first)}>{item.first}</li>
                                        })
                                    }
                                </ul>
                                <h4>历史记录</h4>
                                <ul>
                                    {
                                        this.state.historySearch.map((item, index) => {
                                            return <li key={`${item}${index}`} onClick={this.searchFn(item)}>{item}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        ) : (
                            <div className="not-default-search-box">
                                <h4><i className="iconfont icon-yinle1"></i>歌曲</h4>
                                <ul>
                                    {
                                        this.state.searchSuggest.songs ? this.state.searchSuggest.songs.map(item => {
                                            return <li onClick={this.searchResultClick('song', item)} key={item.id} dangerouslySetInnerHTML={{__html:item._fullname}}></li>
                                        }) : ''
                                    }
                                </ul>
                                <h4><i className="iconfont icon-gedan"></i>歌单</h4>
                                <ul>
                                    {
                                        this.state.searchSuggest.playlists ? this.state.searchSuggest.playlists.map(item => {
                                            return <li onClick={this.searchResultClick('playlists', item)} key={item.id} dangerouslySetInnerHTML={{__html:item._fullname}}></li>
                                        }) : ''
                                    }
                                </ul>
                            </div>
                        )
                    }
                </div>
                <ErrorShow/>
                <audio 
                    id="audio" 
                    src={this.props.player.playInfo.url}
                    onTimeUpdate={this.timeUpdate}
                    onEnded={this.ended}
                    onCanPlay={this.onReady}
                    onError={this.onError}
                ></audio>
            </div>
        )
    }
}
export default connect(state => {
    return {
        player: state.playerReducer,
        app: state.appReducer
    }
},  dispatch => {
    return {
        setVolumn: function(volumn) {
            dispatch(changeVolumn(volumn))
        },
        setPlayTime: function(time) {
            dispatch(changePlayTime(time))
        },
        setPlayInfo: function(info) {
            dispatch(changePlayInfo(info))
        },
        setPlayList: function(list) {
            dispatch(changePlayList(list))
        },
        setPlayIndex: function(index) {
            dispatch(changePlayIndex(index))
        },
        setErrorShow: function(errorShow) {
            dispatch(changeErrorShow(errorShow))
        },
        setPlayState: function(state) {
            dispatch(changePlayState(state))
        }
    }
}
)(Home)