/**
 * Created by 松松 on 13-12-3.
 */


var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID
var helper = require('helper')

//获取所有文章分类，并且统计数量
//TODO:这个查询太耗资源，应该设置一个缓存

app.get('/design-works/json/category', function (req, res) {
    var designWorks = new db.mongodb.Collection(db.Client, 'design-works')
    var category = {}
    designWorks.distinct('category', function (err, docs) {
        var readyNum = 0
        docs.forEach(function (_category) {
            designWorks.count({category: _category}, function (err, count) {
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