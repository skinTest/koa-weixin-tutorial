const fsp = require('./libs')
const path = require('path')

module.exports = {
    appID: 'wx8abc2d9df3edb9dc',
    appSecret: 'f5fed50a6eb248d32e22b3ebe8a6ff31',
    token: 'ExilodasReallyAmazing',
    getAccessToken: function () {
        return fsp.readFileAsync(wechat_file)
    },
    saveAccessToken: function (data) {
        data = JSON.stringify()
        return fsp.writeFileAsync(wechat_file)
    }
}
