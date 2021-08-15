export const changePlayInfo = (playInfo) =>{
    return { type: 'change_playInfo',data: playInfo}
}

export const changePlayTime = (time) =>{
    return { type: 'change_playTime',data: time}
}

export const changePlayList = (list) =>{
    return { type: 'change_playList',data: list}
}

export const changePlayIndex = (index) =>{
    return { type: 'change_playIndex',data: index}
}

export const changePlayState = (state) =>{
    return { type: 'change_playState',data: state}
}

export const changeVolumn = (volumn) =>{
    return { type: 'change_volumn',data: volumn}
}

export const changeOrder = (order) =>{
    return { type: 'change_order',data: order}
}