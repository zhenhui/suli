/**
 * Created by 松松 on 13-10-28.
 */
var fs = require('fs')
var path = require('path')
var app = require('app')
var helper = require('./helper')
var template = require('template')

//test
var Memcached = require('memcached')

var memServer = new Memcached('127.0.0.1:11211');


exports.mimeTypeMap = {
    js: 'application/javascript;charset=utf-8',
    jsonp: 'application/javascript;charset=utf-8',
    css: 'text/css;charset=utf-8',
    default: 'text/html;charset=utf-8'
}

app.get(/^\/go\/(.+)/, function (req, res) {
    var page_url = req.params && req.params[0] ? req.params[0] : false
    exports.readPage(page_url, function (str, status) {
        if (status > 0 && status < 500) res.status(status)

        var mimeType = ''
        if (exports.mimeTypeMap[req.query.format]) {
            mimeType = exports.mimeTypeMap[req.query.format]
        } else if (req.query.callback) {
            mimeType = exports.mimeTypeMap.js
        } else {
            mimeType = exports.mimeTypeMap.default
        }
        res.header('content-type', mimeType)
        try {
            if (str.indexOf(helper.isDynmaic) > -1) {
                str = template.render(str.replace(helper.isDynmaic, ''), {})
            }
            if (req.query.callback) {
                res.end(req.query.callback + "(" + str + ");")
            } else {
                res.end(str)
            }
        } catch (e) {
            res.end('500 error' + e.toString())
        }
    })
})

exports.readPage = function (page_url, callback) {

    if (!page_url) {
        callback('Not Found', 404)
        return
    }


    memServer.get(page_url, function (err, data) {


        if (!err && data) {
            console.log(page_url + '命中缓存')
            callback(data)
        } else {
            console.log(page_url + '开始从磁盘读取')
            var filePath = path.join(helper.staticBaseDir, page_url + '.jstpl')
            fs.readFile(filePath, function (err, buffer) {
                if (err) {
                    console.log(page_url + '读取失败')
                    callback('Not Found', 404)
                    return
                }
                console.log(page_url + '读取成功')
                callback(buffer.toString())
                memServer.set(page_url, buffer.toString(), 3600, function (err) {
                    if (err) console.log('Fail:Not set:' + page_url + ' to memcached')
                });
            })
        }

    });
}

exports.update = function (page_url) {
    memServer.del(page_url, function (err) {
        if (err) {
            console.log('Fail:Can not delete:' + page_url + ' at memcached')
        } else {
            console.log('Success:delete:' + page_url + ' at memcached')
        }
    });
}