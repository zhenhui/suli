/**
 * Created by 松松 on 13-11-29.
 */

var app = require('app')
var db = require('db')

app.get('/design-works/tag', function (req, res) {
    res.render('design-works/tag', {})
})

//根据tag或者类目过滤数据
app.get('/design-works/filter/json', function (req, res) {

    var filter = {}
    var tag = req.query.tag ? req.query.tag.split(',') : ''
    var category = req.query.category ? req.query.category.split(',') : ''

    if (Array.isArray(tag) && tag.length > 0) {
        filter.tag = {$in: tag}
    }

    if (Array.isArray(category) && category.length > 0) {
        filter.category = {$in: category}
    }

    var design = new db.mongodb.Collection(db.Client, 'design-works')

    design.count(filter, function (err, count) {

        //每次最多返回50条
        var pageCount = parseInt(req.query.count, 10)
        pageCount = !isNaN(pageCount) && pageCount <= 50 && pageCount > 0 ? pageCount : 5

        var result = {
            pageCount: pageCount,
            sumPage: Math.ceil(count / pageCount)
        }

        //当前页码
        var page = parseInt(req.query.page, 10)
        page = isNaN(page) || page > result.sumPage || page < 1 ? 1 : page

        result.page = page

        design.find(filter, {_id: 1, title: 1, content: 1, thumbnails_id: 1, owner_id: 1, index: 1}).toArray(function (err, docs) {
            result.data = docs
            setTimeout(function () {
                res.jsonp(result)
            }, 400)
        })
    })
})