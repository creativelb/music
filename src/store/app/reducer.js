import {getItem, setItem} from '@/storage/index.js'

let token = getItem('token')

let init = {
    token: token || '',
    errorShow: {
        isShow: false,
        message: ''
    }
}

export const appReducer = function (state = init, action) {
    let type = action.type
    let data = action.data
    switch (type) {
        case 'change_token':
            return {...state, token: data}
        case 'change_errorShow':
            return {...state, errorShow: data}
        default:
            return {...state}
    }
}