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

        //更新user表中的作品数量
        var user = new DB.mongodb.Collection(DB.userClient, 'user')
        design.count({owner_id: req.session._id, status: {$gte: 1}}, function (err, count) {
            if (count >= 0) {
                user.update({_id: DB.mongodb.ObjectID(req.session._id)}, {$set: {'index.design-works': count}}, {}, function (err, result) {
                    if (!err && result === 1) {
                        console.log('成功更新user中的作品数量指标', result)
                    } else {
                        console.log('失败：更新user中的作品数量指标', err, result)
                    }
                })
            } else {
                console.log('失败：无法统计count并更新到user表中', err)
            }
        })

    })
})