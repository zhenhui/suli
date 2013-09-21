/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-21
 * Time: 下午4:57
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var DB = require('db')
var ObjectID = DB.mongodb.ObjectID

app.post('/design-works/comment/new', function (req, res) {
    if (require('helper').isLogin(req) === false) {
        res.json({err: '未登陆'})
        return
    }
    var comment = new DB.mongodb.Collection(DB.Client, 'design-works-comment')
    comment.insert({id: req.body._id, content: req.body.content, owner: req.session._id}, {safe: true}, function (err, docs) {
        if (!err && docs.length > 0) {
            res.json({docs: docs[0]})
        } else {
            res.json({err: '无法添加评论'})
        }
    })
})