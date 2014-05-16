/**
 * Created by 松松 on 13-10-15.
 */

var app = require('app')
var db = require('db')
var helper = require('helper')
var removeHTMLTag = /(?:<[^>]*>|&nbsp(?:;)?|[\r\n\s])/gm

app.get('/article', function (req, res) {

    var category = req.query.category
    var filter = {status: {$gte: 1}}
    if (category) filter.category = category

    var article = new db.mongodb.Collection(db.Client, 'article')
    article.find(filter, {}).sort({ts: -1}).toArray(function (err, docs) {
        docs = docs.map(function (obj) {
            if (typeof obj.content === 'string') {
                obj.content = obj.content.replace(removeHTMLTag, '').substring(0, 100)
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
    article.distinct('category', {status: {$gte: 1}}, function (err, docs) {
        var readyNum = 0
        docs.forEach(function (_category) {
            article.count({category: _category}, function (err, count) {
                readyNum++
                if (!err) {
                    category[_category] = count
                }
                if (readyNum >= docs.length) {
                    //排序下
                    var newCategory = {}
                    Object.keys(category).sort(function (a, b) {
                        return a < b
                    }).forEach(function (item) {
                            newCategory[item] = category[item]
                        })
                    res.jsonp(newCategory)
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
                obj.content = obj.content.replace(removeHTMLTag, '').substring(0, 100)
            }
            return obj
        })
        res.jsonp({status: 1, docs: docs})
    })
})


//文章详情页
app.get(/^\/article\/(.+)/, function (req, res) {
    var title = req.params[0]
    var article = new db.mongodb.Collection(db.Client, 'article')
    article.findOne({title: title, status: {$gte: 1}}, function (err, result) {
        if (!err && result) {
            //删除空余的P标签
            result.content = result.content.replace(/<p>\s*?&nbsp;\s*?<\/p>/gmi, '')
            res.render('article/detail', result)
        } else {
            res.redirect('/article')
        }
    })
})

//获取某个人的文章摘要
app.get('/user/article/json', function (req, res) {
    var article = new db.mongodb.Collection(db.Client, 'article')
    var id = req.query._id
    if (!id) {
        res.jspnp()
        return
    }

    article.find({owner_id: id}, {}).toArray(function (err, docs) {
        docs = docs.map(function (obj) {
            obj.content = obj.content.replace(removeHTMLTag, '')
            obj.content = obj.content.length > 80 ? obj.content.substring(0, 80) + '...' : obj.content
            return obj
        })
        res.jsonp(docs)
    })
})
