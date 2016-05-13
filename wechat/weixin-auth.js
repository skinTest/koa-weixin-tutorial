'use strict'

/*!
 * weixin auth
 * this middleware is used to authorize from weixin
 * the opts should have token
 */

const sha1 = require('sha1')
const AccessToken = require('./access-token')

module.exports = function(opts) {
    const accessToken = new AccessToken(opts)
    return function* (next) {
        console.dir(this.query)
        // get info for sha1 -> use es6 destructure assign to simplify this boilerplate
        let signature = this.query.signature
        let nonce = this.query.nonce
        let timestamp = this.query.timestamp
        let echostr = this.query.echostr
        let token = opts.token

        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)

        if(sha === signature) {
            this.body = echostr + ''
        } else {
            this.body = 'it is not ok to hack me'
            console.log('some other requested our server')
            console.dir(this.query)
        }
    }
}
