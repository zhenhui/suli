/**
 * Created by 松松 on 13-10-15.
 */

var helper = require('helper')
var DB = require('db')
var app = require('app')

//删除作品
app.get('/design-works/delete', function (req, res) {

    var result = {err: []}

    try {
        var id = DB.mongodb.ObjectID(req.query.id)
    } catch (e) {
        result.err.push('不正确的参数')
        res.json(result)
        return
    }

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登db陆')
        res.jsonp(result)
        return
    }

    var design = new DB.mongodb.Collection(DB.Client, 'design-works')

    //将status更改为适当的值，完成删除操作
    design.update({_id: id, owner_id: req.session._id}, {$set: {status: -10 }}, {}, function (err, num) {
        if (!err && num > 0) {
            result.status = 1
            delete result.err
        } else {
            result.status = -2
            result.err.push('无法删除')
        }
        res.jsonp(result)
    })
})