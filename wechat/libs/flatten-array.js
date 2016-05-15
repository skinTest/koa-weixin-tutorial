'use strict'

function formatMessage(result) {
    let message = {}

    if (typeof result === 'object') {
        let keys = Object.keys(result)

        for (let i = 0; i < keys.length; i++) {
            let item = result[keys[i]]
            let key = keys[i]

            if (!(item instanceof Array) || item.length === 0) {
                continue
            }
            if (item.length === 1) {
                let val = item[0]

                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                }
                else {
                    message[key] = (val || '').trim()
                }
            }
            else {
                message[key] = []
                for (let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }

    return message
}

module.exports = formatMessage
