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
app.get('/design-works/hot/list', function (req, res) {

    var userArr = []
    var count = parseInt(req.query.count, 10)
    var maxCount = 8
    var maxUser = 10

    if (req.query.user) {
        req.query.user.split(',').forEach(function (id) {
            try {
                userArr.push(ObjectID(id))
            } catch (e) {
                return false
            }
        })
    }

    if (userArr.length > maxUser || isNaN(count) || count > maxCount) {
        res.jsonp({ err: ['最多仅支持' + maxUser + '个用户同时查询的' + maxCount + '个最新作品']})
        return
    }

    //  console.log(req.query)

    var design = new db.mongodb.Collection(db.Client, 'design-works')
    var user = new db.mongodb.Collection(db.userClient, 'user')

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
            if (obj.privacy_information) {
                Object.keys(obj.privacy_information).forEach(function (key) {
                    //只返回用户愿意公开的个人信息,10代表全局公开
                    if (obj.privacy_information[key].code < 10) {
                        delete obj.privacy_information[key]
                    } else {
                        //不让权限设置暴露给用户
                        delete obj.privacy_information[key].code
                    }
                })
            }
            userArr.push(obj._id)
            result[obj._id] = {
                user: obj
            }
        })

        //开始查询用户最近上传的8个作品
        var readyNum = 0
        userArr.forEach(function (id) {
            design.find({owner_id: id.toString(), status: {$gte: 1}}, {thumbnails_id: 1}).sort({ts: -1}).limit(8).toArray(function (err, thumbnails) {
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


//最新上传作品，支持分页
app.get('/design-works/latest/list', function (req, res) {

    var design = new db.mongodb.Collection(db.Client, 'design-works')
    var defaultFindParam = {type: 'own', status: {$gte: 1}}

    design.count(defaultFindParam, function (err, count) {

        //每次最多返回50条
        var pageCount = parseInt(req.query.count, 10)
        pageCount = !isNaN(pageCount) && pageCount <= 50 && pageCount > 0 ? pageCount : 5


        var result = {
            pageCount: pageCount,
            sumPage: Math.ceil(count / pageCount)
        }

        //当前页码
        var page = parseInt(req.query.page, 10)
        page = isNaN(page) || page > result.sumPage || page < 1 ? 1 : page

        result.page = page

        design.find(defaultFindParam, {
            _id: 1, title: 1, content: 1, thumbnails_id: 1, file_id: 1, owner_id: 1, index: 1}).sort({ts: -1}).
            skip((page - 1) * pageCount).limit(pageCount).toArray(function (err, docs) {
                result.data = docs
                res.jsonp(result)
            })
    })
})

//根据作品id返回作品的相关数据
app.get('/design-works/fromid/list', function (req, res) {

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

    var design = new db.mongodb.Collection(db.Client, 'design-works')
    design.find({_id: {$in: arr}, status: {$gte: 1}}, {_id: 1, title: 1, content: 1, thumbnails_id: 1, owner_id: 1, index: 1}).toArray(function (err, docs) {
        res.jsonp({data: docs})
    })
})


//根据作品id返回作品的相关数据
app.get('/user/design-works/json', function (req, res) {
    var design = new db.mongodb.Collection(db.Client, 'design-works')
    design.find({owner_id: req.query._id, type: 'own', status: {$gte: 1}}, {}).sort({ts: -1}).toArray(function (err, docs) {
        res.jsonp(docs)
    })

})
