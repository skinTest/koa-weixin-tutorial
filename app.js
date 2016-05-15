'use strict'

const Koa = require('koa')
const path = require('path')
const fsp = require('./libs/fs-promisify')
const weixinAuth = require('./wechat/weixin-auth')
const config = require('./config')

const app = new Koa()

app.use(weixinAuth(config.weixinAuth))

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function () {
    console.log('Koa server is running');
});
