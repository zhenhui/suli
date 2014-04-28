
var helper = require('helper')
var DB = require('db')
var app = require('app')

//删除作品
app.get('/design-works/up-tv', function (req, res) {

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

    //上电视
    design.update({_id: id, owner_id: req.session._id}, {$set: {tv : req.query.tv === 'true' ? true : false }}, {}, function (err, num) {
        if (!err && num > 0) {
            result.status = 1
            delete result.err
        } else {
            result.status = -2
            result.err.push('无法上电视')
        }
        res.jsonp(result)

    })
})
