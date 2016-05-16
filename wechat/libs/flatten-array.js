'use strict'

function formatMessage(content) {
    let result = {}

    // if (typeof content === 'object' && !(Array.isArray(content))) {
    if (typeof content === 'object' && !(Array.isArray(content))) {
        let keys = Object.keys(content)
        // console.log('---------------------------iterate keys')
        // console.dir(keys)

        for (let i = 0; i < keys.length; i++) {
            let item = content[keys[i]]
            let key = keys[i]
            // console.log('-------------i iteration for key:       %s', key)
            // console.dir(item)

            if (typeof item === 'object' && !(Array.isArray(item))) {
                result[key] = formatMessage(item)
                // console.log("typeof item === 'object' && !(Array.isArray(item))")
            } else if (!Array.isArray(item) || item.length === 0) {
                // console.log("!Array.isArray(item) || item.length === 0")
                continue
            } else if (item.length === 1) {
                // console.log("length === 1")
                let val = item[0]
                // console.log('------------------type judgement')
                // console.log(typeof val)
                if (typeof val === 'object') {
                   result[key] = formatMessage(val)
                } else {
                    // console.log('key else called')
                   result[key] = (val || '').trim()
                   // console.log(result)
                }
            } else {
                console.log("an array is been iterated again")
                result[key] = []
                for (let j = 0; j < item.length; j++) {
                    result[key].push(formatMessage(item[j]))
                }
            }
        } // end of keys iteration

    } // end of object management

    else {
        return content
    }

    return result
}

module.exports = formatMessage
