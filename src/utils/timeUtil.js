export const formateTimeToMmSs = (time) => {
    // 参数是毫秒形式的
    time = time / 1000
    let minute = '00'+ parseInt(time / 60)
    minute = minute.substring(minute.length-2)
    let second = '00'+ parseInt(time % 60)
    second = second.substring(second.length-2)
    return `${minute}:${second}`
} 