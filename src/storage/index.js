let storage = window.localStorage

export function getItem(key) {
    let value = storage.getItem(key)
    value = JSON.parse(value)
    return value
}

export function setItem(key, value) {
    if(typeof value === 'object' && value !== null) {
        value = JSON.stringify(value)
    }
    return storage.setItem(key, value)
}