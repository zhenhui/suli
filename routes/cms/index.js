/**
 * Created by 松松 on 13-10-19.
 */


var app = require('app')
var helper = require('helper')

//新建模板
require('./new')

//编辑模板源代码
require('./edit-source')

//编辑模板数据
require('./edit-data')

//保存数据
require('./save-data')

//发布
require('./publish')

//展示
require('./go')

//代码回滚
require('./rollback-data-source')

var db = require('db')

app.get('/cms', helper.csrf, function (req, res) {
    var tpl = new db.Collection(db.Client, 'cms-tpl')
    tpl.find({status: 1}, {}).sort({ts: -1}).toArray(function (err, docs) {
        res.render('cms/cms', {docs: docs})
    })
})

