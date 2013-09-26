/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-26
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var DB = require('db')

app.get(/\/avatar\/([^_]+)(?:_)?(\w+)?$/, function (req, res) {

    var ownerId = req.params[0]
    var size = req.params[1]

    if (!ownerId || !size) {
        res.end()
        return
    }

    var file = new DB.mongodb.Collection(DB.Client, 'fs.files')

    file.findOne({_id: new RegExp(ownerId + '(.+)' + size)}, {fields: {
        _id: 1,
        md5: 1,
        uploadDate: 1
    }, sort: [
        ['uploadDate', -1]
    ]}, function (err, docs) {
        if (docs) {
            if (!req.headers['if-none-match'] || req.headers['if-none-match'] !== docs.md5) {
                var gs = new DB.mongodb.GridStore(DB.dbServer, docs._id, "r")
                res.header('ETag', docs.md5)
                res.header('Cache-Control', 'max-age=315360000');
                res.header('Expires', ' Tue, 10 Jan 2023 02:19:00 GMT');
                res.header('Last-Modified', ' Tue, 10 Jan 2000 02:19:00 GMT');
                gs.open(function (err, gs) {
                    if (!err) {
                        gs.read(gs.length, function (err, data) {
                            res.end(data)
                        })
                    } else {
                        res.end()
                    }
                })
            } else {
                res.status(304)
                res.end()
            }
        } else {
            res.end()
        }
    })
})
