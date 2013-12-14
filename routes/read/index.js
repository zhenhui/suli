/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-13
 * Time: 下午3:32
 * To change this template use File | Settings | File Templates.
 */
var app = require('app')
var db = require('db')

var map = {
    'full-size': '优化后的全尺寸',
    'origin': '原图'
}


app.get(/\/read\/(.+)/i, function (req, res) {
    res.header('Cache-Control', 'max-age=315360000')
    res.header('Expires', ' Tue, 10 Jan 2023 02:19:00 GMT')
    res.header('Last-Modified', ' Tue, 10 Jan 2000 02:19:00 GMT')

    var url = req.params[0]
    if (req.headers['if-modified-since']) {
        res.status(304)
        res.end()
    } else {
        if (map[req.query.m]) {
            var fs = new db.mongodb.Collection(db.Client, 'fs.files')
            fs.findOne({
                _id: new RegExp(url.substring(0, 24)),
                'metadata.type': map[req.query.m]
            }, {_id: 1, "metadata.type": 1}, function (err, doc) {
                if (!err && doc) {
                    response(res, doc._id)
                } else {
                    res.end()
                }
            })
        } else {
            response(res, url)
        }
    }
})

function response(res, _id) {
    var gs = new db.mongodb.GridStore(db.dbServer, _id, "r")
    gs.open(function (err, gs) {
        if (!err) {
            gs.read(gs.length, function (err, data) {
                res.end(data)
            })
        } else {
            res.end()
        }
    })
}