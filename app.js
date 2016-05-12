'use strict'

const Koa = require('koa')
const weixin_auth = require('./wechat/weixin-auth')
const config = {
    weixin_auth: {
        appID: 'wx8abc2d9df3edb9dc',
        appSecret: 'f5fed50a6eb248d32e22b3ebe8a6ff31',
        token: 'ExilodasReallyAmazing'
    }
}

const app = new Koa()

app.use(weixin_auth(config.weixin_auth.token))

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function () {
    console.log('Koa server is running');
});
