'use strict'

const Koa = require('koa')
const sha1 = require('sha1')
const config = {
    weixin_auth: {
        appID: 'wx8abc2d9df3edb9dc',
        appSecret: 'f5fed50a6eb248d32e22b3ebe8a6ff31',
        token: 'ExilodasReallyAmazing'
    }
}

const app = new Koa()

app.use(function* (next) {
    console.dir(this.query)
    // get info for sha1 -> use es6 destructure assign to simplify this boilerplate
    let token = config.weixin_auth.token
    let signature = this.query.signature
    let nonce = this.query.nonce
    let timestamp = this.query.timestamp
    let echostr = this.query.echostr

    let str = [token, timestamp, nonce].sort().join('')
    let sha = sha1(str)

    if(sha === signature) {
        this.body = echostr + ''
    } else {
        this.body = 'it is not ok to hack me'
        console.log('some other requested our server')
        console.dir(this.query)
    }

})

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function () {
    console.log('Koa server is running');
});
