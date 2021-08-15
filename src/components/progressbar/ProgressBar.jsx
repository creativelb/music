import React, { useEffect, useState,useRef ,useReducer} from "react";

import './ProgressBar.scss'

export default function ProgressBar(props) {

    const progressBar = useRef()
    const [domWidth, setDomWidth] = useState(0)
    const [moveProgressBar, setMoveProgressBar] = useState(false)

    useEffect(() => {
        let width = progressBar.current.getBoundingClientRect().width
        setDomWidth(width)
    }, [])

    let changeProgress = (e) => {
        let left = e.target.getBoundingClientRect().left
        let percent = (e.clientX - left) / domWidth
        props.percentChange(percent)
    }

    return (
        <div className="ProgressBar" ref={progressBar} onClick={changeProgress}>
            <div className="default-line" style={{height: props.height}}></div>
            <div className="line" style={{height: props.height, width: props.percent * domWidth}}></div>
            <div 
                className="circle" 
                style={{
                    display: props.alwaysDot || moveProgressBar ? 'block' : 'none',
                    left: props.percent * domWidth
                }}>
            </div>
        </div>
    )
}