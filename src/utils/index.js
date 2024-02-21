import nFormat from 'number-format.js'

export function numberFormat(value, mask = '00') {
    return nFormat(mask, parseFloat(value))
}

export function getTimeBeforeRotation(rotationPeriod, rotationOffset = 0) {
    const now = new Date(Date.now() + rotationOffset)
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8 - now.getDay())
    return target.valueOf() - now.valueOf() // msBeforeNextPeriod
}

export function randomFloat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}