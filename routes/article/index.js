/**
 * Created by 松松 on 13-10-15.
 */

var app = require('app')
var db = require('db')
var helper = require('helper')


app.get('/article', helper.csrf, function (req, res) {

    var category = req.query.category
    var filter = {status: {$gte: 1}}
    if (category) filter.category = category

    var article = new db.mongodb.Collection(db.Client, 'article')
    article.find(filter, {}).sort({ts: -1}).toArray(function (err, docs) {
        docs = docs.map(function (obj) {
            if (typeof obj.content === 'string') {
                obj.content = obj.content.replace(/(?:<.*?>|&nbsp;)/gmi, '').substring(0, 100)
                console.log(obj)
            }
            return obj
        })
        res.render('article/index', {data: docs})
    })
})


//获取所有文章分类，并且统计数量
app.get('/article/json/category', function (req, res) {
    var article = new db.mongodb.Collection(db.Client, 'article')
    var category = {}
    article.distinct('category', function (err, docs) {
        console.log(err, docs)
        var readyNum = 0
        docs.forEach(function (_category) {
            article.count({category: _category}, function (err, count) {
                readyNum++
                if (!err) {
                    category[_category] = count
                }
                if (readyNum >= docs.length) {
                    res.jsonp(category)
                }
            })
        })
    })
})

//获取自己的文章列表
app.get('/personal/article/list', function (req, res) {
    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    var article = new db.mongodb.Collection(db.Client, 'article')
    article.find({owner_id: req.session._id, status: {$gte: 1}}, {}).sort({ts: -1}).toArray(function (err, docs) {
        docs = docs.map(function (obj) {
            if (typeof obj.content === 'string') {
                obj.content = obj.content.replace(/(?:<.*?>|&nbsp;)/gmi, '').substring(0, 100)
            }
            return obj
        })
        res.jsonp({status: 1, docs: docs})
    })
})
