export function changeToken(token) {
    return {type: 'change_token', data: token}
}

export function changeErrorShow(errorShow) {
    return {type: 'change_errorShow', data: errorShow}
}