/**
 * Created by 松松 on 13-11-5.
 */

var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID


//获取某个人最近的作品列表
//返回的个人信息中，只包含昵称
//如果是登陆用户，则可以返回QQ或微博地址

// /design-works/list?users=arr1,arr2,...&count=10
app.get('/design-works/list', function (req, res) {

    var userArr = []
    var count = req.query.count

    if (req.query.user) {
        req.query.user.split(',').forEach(function (id) {
            try {
                userArr.push(ObjectID(id))
            } catch (e) {
                return false
            }
        })
    }

    if (userArr.length > 10) {
        res.jsonp({ err: ['最多仅支持10个用户同时查询']})
        return
    }

    //  console.log(req.query)

    var design = new db.mongodb.Collection(db.Client, 'design-works')
    var user = new db.mongodb.Collection(db.Client, 'user')

    var fields = {
        _id: 1,
        user: 1
    }

    //如果是登陆用户，则返回更多的，且隐私 >=10 的用户信息
    if (require('helper').isLogin(req)) {
        fields.privacy_information = 1
    }

    var result = {}

    user.find({_id: {$in: userArr}}, {_id: 1, user: 1, 'privacy_information': 1}).toArray(function (err, docs) {
        //重新设置数组，过滤掉不存在的用户
        userArr = []
        docs.map(function (obj) {
            Object.keys(obj.privacy_information).forEach(function (key) {
                //只返回用户愿意公开的个人信息,10代表全局公开
                if (obj.privacy_information[key].code < 10) {
                    delete obj.privacy_information[key]
                } else {
                    //不让权限设置暴露给用户
                    delete obj.privacy_information[key].code
                }
            })
            userArr.push(obj._id)
            result[obj._id] = {
                user: obj
            }
        })

        //开始查询用户最近上传的8个作品
        var readyNum = 0
        userArr.forEach(function (id) {
            design.find({owner_id: id.toString() }, {thumbnails_id: 1}).sort({ts: -1}).limit(8).toArray(function (err, thumbnails) {
                readyNum++
                if (result[id.toString()] === undefined) result[id.toString()] = {}
                result[id.toString()].thumbnails = !err ? thumbnails : []
                if (readyNum >= userArr.length) {
                    res.jsonp(result)
                }
            })
        })
    })
})