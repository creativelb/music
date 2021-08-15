import React, { useEffect, useState,useRef ,useReducer} from "react";
import {useSelector,useDispatch} from 'react-redux'
import {changeErrorShow} from '@/store/app/action.js'
import './ErrorShow.scss'

export default function ErrorShow(props) {
    const errorShowAnimation = useRef()
    const dispitch = useDispatch()
    const errorShow = useSelector(state => state.appReducer.errorShow)
    const [active, setActive] = useState(false)
    const [className, setClassName] = useState('ErrorShow-fade-in')

    let hide = function() {
        setClassName('ErrorShow-fade-out')
        dispitch(changeErrorShow({isShow: false, message: ''}))
    }

    let aniamtionEnd = function() {
        console.log('aniamtionEnd调用了');
        if(!errorShow.isShow) {
            setActive(false)
        }
    }

    useEffect(() => {
        if(errorShow.isShow) {
            setActive(true)
            setClassName('ErrorShow-fade-in')
        }
        
    }, [errorShow.isShow])

    return (
        <div 
            ref={errorShowAnimation}
            className={`ErrorShow ${className}`} 
            style={{display: active ? 'block' : 'none'}}
            onAnimationEnd={aniamtionEnd}
            >
            <div className="header">
                <span className="message">出错了</span>
                {/* <i className="iconfont icon-cuowu"></i> */}
            </div>
            <div className="content">
                错误码为: {errorShow.message}
            </div>
            <div className="sure" onClick={hide}>
                确定
            </div>
        </div>
    )
}