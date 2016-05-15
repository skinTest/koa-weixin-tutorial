'use strict'

const xml2js = require('xml2js')
const Promise = require('bluebird')

module.exports = function (xml) {
    return new Promise(function(resolve, reject) {
        xml2js.parseString(xml, {trim: true}, function(err, content) {
            err && reject(err)
            resolve(content)
        })
    })
}
