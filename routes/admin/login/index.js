/**
 * Created by 松松 on 13-12-4.
 */

var app = require('app')
var db = require('db')

//记录浏览器错误日志
app.post('/admin/log/browser-log', function (req, res) {
    res.end()
    var log = {body: req.body, headers: req.headers, ts: Date.now()}
    var browserLog = new db.Collection(db.Client, 'browser-log')
    browserLog.insert(log, {w: 1}, function (err) {
    })
})