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

//CMS系统首页
app.get('/cms', function (req, res) {

    if (!helper.isLogin(req)) {
        res.render('invalid-group', {title: '您没有登陆', status: -10, err: ['CMS需要登陆方可使用']})
        return
    }

    helper.getGroup(req, function (group) {
        if (Array.isArray(group) === false) {
            res.render('invalid-group', {title: '无权限', err: [ '暂无权限']})
            return
        }

        if (group.indexOf('CMS') >= 0) {
            var tpl = new db.Collection(db.Client, 'cms-tpl')
            tpl.find({status: 1}, {}).sort({ts: -1}).toArray(function (err, docs) {
                res.render('cms/cms', {docs: docs})
            })
        } else {
            res.render('invalid-group', {title: '无权限', err: [ '您无CMS系统权限']})
        }
    })
})


