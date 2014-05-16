/**
 * Created by 松松 on 13-11-29.
 */

var app = require('app')
var db = require('db')
var helper = require('./helper')

//历史列表
app.get('/cms/rollback/history', function (req, res) {

    try {
        var id = db.mongodb.ObjectID(req.query.page_id)
    } catch (e) {
        res.jsonp({err: ['无法查询到任何数据']})
        return
    }

    var tplSource = new db.Collection(db.Client, 'cms-tpl-source')
    tplSource.find({page_id: id}, {_id: 1, owner_name: 1, owner_id: 1, ts: 1, page_name: 1})
        .sort({ts: -1}).limit(50).toArray(function (err, docs) {
            if (!err) {
                res.jsonp(docs ? docs : null)
            } else {
                res.jsonp({err: ['无法查询到任何数据']})
            }
        })

})

//恢复代码到指定版本
app.get('/cms/rollback/version', function (req, res) {

    try {
        var id = db.mongodb.ObjectID(req.query.version_id)
    } catch (e) {
        res.jsonp({err: ['无法查询到任何数据']})
        return
    }

    var tplSource = new db.Collection(db.Client, 'cms-tpl-source')
    tplSource.findOne({_id: id}, {}, function (err, docs) {
        if (docs) {
            delete docs._id

            //更新必要的参数

            docs.ts = Date.now()
            docs.owner_name = req.session.user
            docs.owner_id = req.session._id
            tplSource.insert(docs, {w: 1}, function (err, result) {
                if (!err) {
                    res.jsonp(result)
                } else {
                    res.jsonp(null)
                }
            })
        } else {
            res.jsonp(null)
        }
    })

})


//查看某个版本的源代码
app.get(/\/cms\/tpl-source\/version\/([a-z0-9]{24})/, function (req, res) {

    try {
        var id = db.mongodb.ObjectID(req.params[0])
    } catch (e) {
        res.jsonp({err: ['无法查询到任何数据']})
        return
    }

    var tplSource = new db.Collection(db.Client, 'cms-tpl-source')
    tplSource.findOne({_id: id}, {source: 1}, function (err, docs) {
        res.header('content-type', 'text/plain;charset=utf-8')
        if (docs) {
            res.end(docs.source)
        } else {
            res.end('错误：找不到该版本的代码')
        }
    })

})
