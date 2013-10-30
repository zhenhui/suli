/**
 * Created by 松松 on 13-10-15.
 */

var app = require('app')
var DB = require('db')

app.get('/personal/article/list', function (req, res) {
    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    var article = new DB.mongodb.Collection(DB.Client, 'article')
    article.find({owner_id: req.session._id, status: {$gte: 1}}, {}).sort({ts: -1}).toArray(function (err, docs) {
        res.jsonp({status: 1, docs: docs})
    })
})
