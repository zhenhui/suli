/**
 * Created by 松松 on 13-11-27.
 */


var app = require('app')
var gm = require('gm')
var path = require('path')
var fs = require('fs')
var db = require('db')

app.get('/email/count', function (req, res) {

    var id = req.query.id

    var count = new db.mongodb.Collection(db.Client, 'email-read-count')

    if (req.query.show !== undefined) {
        count.findOne({id: id}, function (err, docs) {
            res.jsonp(docs)
        })
    } else {
        count.findAndModify({id: id}, [
        ], { $inc: {count: 1}}, {new: true, upsert: true}, function (err, docs) {
            res.header('count', docs.count)
            res.sendfile(path.join(__dirname, 'sjplus.jpg'))
        })
    }
})
