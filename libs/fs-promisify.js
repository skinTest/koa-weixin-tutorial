'use strict'

const fs = require('fs')
const Promise = require('bluebird')

exports.readFileAsync = function (fpath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fpath, encoding, function (err, content) {
            // (err && reject(err)) || resolve(content)
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
}

exports.writeFileAsync = function (fpath, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fpath, content, function (err, content) {
            // (err && reject(err)) || resolve()
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}
