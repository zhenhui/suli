/**
 * Created by 松松 on 13-10-15.
 */

var helper = require('helper')
var DB = require('DB')
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
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    var design = new DB.mongodb.Collection(DB.Client, 'design-works')

    design.findOne({_id: id, owner_id: req.session._id}, {_id: 1}, function (err, data) {
        console.log(data)
    })


})
