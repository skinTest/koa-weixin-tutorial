'use strict'

const fsp = require('./libs/fs-promisify')
const path = require('path')

const wechat_file = path.join(__dirname, './config/wechat.txt')

module.exports = {
    weixinAuth: {
        appID: 'wx8abc2d9df3edb9dc',
        appSecret: 'f5fed50a6eb248d32e22b3ebe8a6ff31',
        token: 'ExilodasReallyAmazing',
        getAccessToken: function () {
            return fsp.readFileAsync(wechat_file)
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data)
            console.log('data from save %s', data)
            return fsp.writeFileAsync(wechat_file, data)
        }
    }
}
