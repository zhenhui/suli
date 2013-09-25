/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var DB = require('db')
var ObjectID = DB.mongodb.ObjectID
var helper = require('helper')

/*作品共享页面*/
app.get('/design-works/share/manage', function (req, res) {

    helper.getGroup(req, function (group) {

        if (!Array.isArray(group)) {
            res.render('invalid-group', {title: '无法获取权限信息', err: ['您没有任何权限信息']})
            return
        }

        //检查是否有上传共享作品的权限
        if (group.indexOf('上传共享作品') < 0) {
            res.render('invalid-group', {title: '禁止访问', err: ['您没有管理共享作品的权限']})
            return
        }

        var share = new DB.mongodb.Collection(DB.Client, 'design-works')
        share.find({owner: req.session._id, status: {$gte: 1}}, {}).sort({ts: -1}).toArray(function (err, docs) {
            res.render('design-works/share/manage', {docs: docs})
        })
    })
})

//设计师作品展示页面
app.get(/\/design-works\/detail\/(\w{24})/, function (req, res) {

    try {
        var id = ObjectID(req.params[0])
    } catch (e) {
        res.render('invalid-group', {title: '无法识别的参数', err: ['']})
        return
    }

    var work = new DB.mongodb.Collection(DB.Client, 'design-works')
    work.findOne({_id: id}, {}, function (err, docs) {
        if (docs) {
            res.render('design-works/share/detail', {docs: docs})
        } else {
            res.render('invalid-group', {title: '木有资源', err: ['无法找到资源']})
        }
    })

})

require('./comment')
