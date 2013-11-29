/**
 * Created by 松松 on 13-10-28.
 */
var fs = require('fs')
var path = require('path')
var app = require('app')
var helper = require('./helper')
var template = require('template')

exports.mimeTypeMap = {
    js: 'application/javascript;charset=utf-8',
    jsonp: 'application/javascript;charset=utf-8',
    css: 'text/css;charset=utf-8',
    default: 'text/html;charset=utf-8'
}

exports.cache = Object.create(null)

//缓存在内存中存活的阈值
exports.ExpiresTs = 3600000

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
            if (str.indexOf('//@SOURCE_TYPE=AMS_DYNAMIC') > -1) {
                str = template.render(str, {})
            }
            if (req.query.callback) {
                res.end(req.query.callback + "(" + str + ");")
            } else {
                res.end(str)
            }
        } catch (e) {
            res.end('500 error')
        }
    })
})

exports.readPage = function (page_url, callback) {

    if (!page_url) {
        callback('Not Found', 404)
        return
    }

    if (exports.cache[page_url]) {
        console.log(page_url + '命中缓存')
        callback(exports.cache[page_url].source)
        //更新时间戳
        exports.cache[page_url].ts = Date.now()
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
            exports.cache[page_url] = Object.create(null)
            exports.cache[page_url].source = buffer.toString()
            exports.cache[page_url].ts = Date.now()
            //将内存中超过maxExpiresTs阈值的缓存清除掉
            exports.clearMemory()
        })
    }
}

//通过删除缓存，达到更新的目的
exports.update = function (page_url) {
    console.log('开始更新缓存' + page_url)
    if (exports.cache[page_url]) {
        delete exports.cache[page_url]
        console.log('更新了' + page_url + '的缓存')
    }
}

//将访问量少的页面，从内存中移除
exports.clearMemory = function () {
    console.log('开始清理缓存')
    Object.keys(exports.cache).forEach(function (item) {
        if (Date.now() - exports.cache[item].ts > exports.ExpiresTs) {
            console.log(item + '被清理')
            delete exports.cache[item]
        }
    })
}
