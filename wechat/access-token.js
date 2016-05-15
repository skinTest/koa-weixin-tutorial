'use strict'

const Promise = require('bluebird')
const request = Promise.promisify(require('request'))

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

/*!
 * AccessToken
 * expire in 7200 seconds
 * get, save, isValid, update
 * get from 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET'
 * opts: { appID, appSecret, getAccessToken, saveAccessToken }
 */
function AccessToken(opts) {
    const that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch(e) {
                return that.updateAccessToken()
            }
            if (that.isValidAccessToken(data)) {
                Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function (data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in

            that.saveAccessToken(data)
        })
}

/*!
 * exist, expire
 * lib: request, which provide higher level api based on http.request and promise
 */
AccessToken.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }

    return new Date().getTime() < data.expires_in ? true : false
}

AccessToken.prototype.updateAccessToken = function () {
    let url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

    return new Promise(function(resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (response) {
            let data = response[1]
            data.expires_in = new Date().getTime() + (data.expires_in - 60) * 1000
            resolve(data)
        })
    })
}

module.exports = AccessToken
