export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function shuffle(array: any) {
    return array.sort(() => Math.random() - 0.5)
}

export function randomStr(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
}

export function ksort(obj){
    const keys = Object.keys(obj).sort()
        , sortedObj = {}

    for (const i in keys) {
        sortedObj[keys[i]] = obj[keys[i]]
    }

    return sortedObj
}

export function validURL(str) {
    return str.match('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')
}

export function removeTags(str) {
    if ((str === null) || (str === '')) return false
    str = str.toString()
    return str.replace(/(<([^>]+)>)/ig, '')
}

export function parseDataTableQuery(query) {
    const draw = query.draw,
        row = query.start,
        length = query.length,
        columnIndex = query.order[0].column,
        columnName = query.columns[columnIndex].data,
        columnSortOrder = query.order[0].dir,
        searchValue = query.search.value

    return { draw, row, length, columnName, columnSortOrder, searchValue }
}