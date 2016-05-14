'use strict'

const Koa = require('koa')
const path = require('path')
const fsp = require('./libs/fs-promisify')
const weixinAuth = require('./wechat/weixin-auth')

const wechat_file = path.join(__dirname, './config/wechat.txt')
const config = {
    weixinAuth: {
        appID: 'wx8abc2d9df3edb9dc',
        appSecret: 'f5fed50a6eb248d32e22b3ebe8a6ff31',
        token: 'ExilodasReallyAmazing',
        getAccessToken: function () {
            return fsp.readFileAsync(wechat_file)
        },
        saveAccessToken: function (data) {
            data = JSON.stringify()
            console.log('data from save %s', data)
            return fsp.writeFileAsync(wechat_file, data)
        }
    }
}


const app = new Koa()

app.use(weixinAuth(config.weixinAuth))

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function () {
    console.log('Koa server is running');
});
