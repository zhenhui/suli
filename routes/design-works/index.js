/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID
var helper = require('helper')

//设计作品首页
app.get('/design-works', function (req, res) {
    res.render('design-works/index')
})

//作品共享接口
app.get('/design-works/share/list', function (req, res) {

    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    helper.getGroup(req, function (group) {

        if (!Array.isArray(group)) {
            result.err.push('无法获取权限信息')
            result.status = -2
            res.jsonp(result)
            return
        }

        //检查是否有上传共享作品的权限
        if (group.indexOf('上传共享作品') < 0) {
            result.err.push('您没有上传共享作品的权限，所以无法进行管理')
            result.status = -3
            res.jsonp(result)
            return
        }

        var share = new db.mongodb.Collection(db.Client, 'design-works')
        share.find({owner_id: req.session._id, type: 'share', status: {$gte: 1}}, {}).sort({ts: -1}).toArray(function (err, docs) {
            res.jsonp({status: 1, docs: docs})
        })
    })
})

//私人作品接口
app.get('/design-works/own/list', function (req, res) {

    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    var share = new db.mongodb.Collection(db.Client, 'design-works')
    share.find({owner_id: req.session._id, type: 'own', status: {$gte: 1}}, {}).sort({ts: -1}).toArray(function (err, docs) {
        res.jsonp({status: 1, docs: docs})
    })
})

//设计师作品展示页面
app.get(/\/design-works\/detail\/(\w{24})/, helper.csrf, function (req, res) {

    try {
        var id = ObjectID(req.params[0])
    } catch (e) {
        res.render('invalid-group', {title: '无法识别的参数', err: ['']})
        return
    }

    var work = new db.mongodb.Collection(db.Client, 'design-works')
    work.findOne({_id: id, status: {$gte: 1}}, {}, function (err, docs) {
        if (docs) {
            res.render('design-works/detail', {docs: docs})
        } else {
            res.render('invalid-group', {title: '木有资源', err: ['无法找到资源']})
        }
    })

})

require('./comment')

require('./delete')

require('./list')

require('./like')

require('./views')