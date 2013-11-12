/**
 * Created by 松松 on 13-11-10.
 */

var app = require('app')
var helper = require('helper')
var db = require('db')
var ObjectID = db.mongodb.ObjectID

app.get(/^\/u\/([0-9a-z]{24})/, function (req, res) {
    var uid = req.params[0]
    try {
        uid = ObjectID(uid)
    } catch (e) {
        res.end('Not Found')
        return
    }
    var user = new db.mongodb.Collection(db.Client, 'user')
    user.findOne({_id: uid}, {group: 1, _id: 1, user: 1, privacy_information: 1}, function (err, result) {
        res.render('u/index', result)
    })
})

//根据ID获取用户的信息数据
//对于登陆用户，才返回个人的一些信息
app.get('/u/json/user-info', function (req, res) {
    if (!req.query.id_arr) {
        res.jsonp({err: ['参数无效']})
        return
    }

    var arr = []
    req.query.id_arr.split(',').filter(function (id) {
        try {
            //检测是否为合法的ID
            arr.push(ObjectID(id))
        } catch (e) {

        }
    })

    if (arr.length > 20 || arr.length < 1) {
        res.jsonp({err: ['仅支持1~20个批量查询']})
        return
    }


    var fields = {
        _id: 1,
        user: 1,
        index: 1
    }

    //如果是登陆用户，则返回更多的，且隐私 >=10 的用户信息
    if (require('helper').isLogin(req)) {
        fields.privacy_information = 1
    }
    var user = new db.mongodb.Collection(db.Client, 'user')
    user.find({_id: {$in: arr}}, fields).sort({ts: -1}).toArray(function (err, docs) {
        //将id作为key，方便检索
        var result = {}
        if (!err && docs.length > 0) {
            docs.forEach(function (u) {
                result[u._id] = u
            })
        }
        res.jsonp(result)
    })
})
