'use strict'
const sha1 = require('sha1')
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

/*!
 * weixin auth
 * this middleware is used to authorize from weixin
 * the opts should have token
 */
function Wechat(opts) {
    let that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.getAccessToken()
        .then(function(data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return that.updateAccessToken()
            }

            if (that.isValidAccessToken(data)) {
                Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function(data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in

            that.saveAccessToken(data)
        })
}

/*!
 * exist, expire
 * lib: request, which provide higher level api based on http.request and promise
 */

Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }

    let access_token = data.access_token
    let expires_in = data.expires_in
    let now = (new Date().getTime())

    if (now < expires_in) {
        return true
    } else {
        return false
    }
    // return new Date().getTime() < data.expires_in ? true : false
}

Wechat.prototype.updateAccessToken = function () {
    let url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

    return new Promise(function(resolve, reject) {
        request({ url: url, json:true })
            .then(function (response) {
                let data = response[1]
                let now = (new Date().getTime())
                let expires_in = now + (data.expires_in - 60) * 1000
                data.expires_in = expires_in
                resolve(data)
            })
    })




    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (response) {
            let data = response[1]
            data.expires_in += new Date().getTime() - (60 * 1000)

            console.log('----------------from update')
            console.dir(data)

            resolve(data)
        })
    })
}

module.exports = function(opts) {
    let wechat = new Wechat(opts)

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
        yield next
    }
}
