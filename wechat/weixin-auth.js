'use strict'
/*!
 * weixin auth
 * this middleware is implemented to authorize from weixin
 * the opts will include the wechat config
 */
const sha1 = require('sha1')
const getRawBofy = require('raw-body')
const AccessToken = require('./access-token')
const xmlParser = require('./libs/xml-parser')
const flattenArray = require('./libs/flatten-array')

module.exports = function(opts) {
    let accessToken = new AccessToken(opts)
    return function* (next) {
        let that = this
        console.dir(this.query)
        // get info for sha1 -> use es6 destructure assign to simplify this boilerplate
        let signature = this.query.signature
        let nonce = this.query.nonce
        let timestamp = this.query.timestamp
        let echostr = this.query.echostr
        let token = opts.token

        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)

/*!
 * manage weixin server's request
 * get: authorize with weixin
 * post: event and so on
 */
        if (this.method === 'GET') {
            if(sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'it is not ok to hack me'
                console.log('some other requested our server')
                console.dir(this.query)
            }
        }
        else if (this.method === 'POST') {
            if(sha !== signature) {
                this.body = 'it is not ok to hack me'
                return false
            }

            // get data from request through raw-body
            let data = yield getRawBofy(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            let content = yield xmlParser(data)
            let message = flattenArray(content)
            message = message.xml
            console.dir(message)

            // process incoming post message with different situation
            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') {
                    let now = new Date().getTime()
                    console.log('---------------------------reply called')
                    that.status = 200
                    that.type = 'application/xml'
                    that.body = '<xml>' +
                                '<ToUserName><![CDATA[' + message.FromUserName + ']]></ToUserName>' +
                                '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' +
                                '<CreateTime>' + now + '</CreateTime>' +
                                '<MsgType><![CDATA[text]]></MsgType>' +
                                '<Content><![CDATA[你好]]></Content>' +
                                '</xml>'
                    return
                }
            }
        }
    }
}
