let init = {
    playInfo: {},
    playTime: 0,
    playList: [],
    playIndex: 0, // 正在播放歌单第几首歌
    // 播放状态: 播放还是暂停
    playState: false,
    volumn: 0.5,
    // 播放顺序 0:顺序 1:单曲 2: 随机
    order: 0
}

export const playerReducer = function (state = init, action) {
    let type = action.type
    let data = action.data
    switch (type) {
        case 'change_playInfo':
            return {...state, playInfo: data}
        case 'change_playTime':
            return {...state, playTime: data}
        case 'change_playList':
            return {...state, playList: data}
        case 'change_playIndex':
            return {...state, playIndex: data}
        case 'change_playState':
            return {...state, playState: data}
        case 'change_volumn':
            return {...state, volumn: data}
        case 'change_order':
            return {...state, order: data}
        default:
            return {...state}
    }
}