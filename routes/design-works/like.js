/**
 * Created by 松松 on 13-11-7.
 */



var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID
var helper = require('helper')

//作品的喜欢数据
app.post('/index/add-like', helper.csrf, function (req, res) {

    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    try {
        var id = ObjectID(req.body.id)
    } catch (e) {
        res.jsonp({status: -2, err: ['必要的参数不正确']})
        return;
    }

    //开始添加喜欢
    var like = new db.mongodb.Collection(db.Client, 'index-like')

    like.update({work_id: id.toString(), owner_id: req.session._id},
        {
            work_id: id.toString(),
            owner_user: req.session.user,
            owner_id: req.session._id,
            ts: Date.now()
        },
        {
            upsert: true, w: 1
        }, function (err, count) {
            if (!err && count > 0) {
                delete result.err
                result.status = 1
            } else {
                result.status = -3
                result.err.push('无法喜欢')
            }
            res.json(result)

            updateLike(id, req.body.type)

        })
})


//自己喜欢的列表
app.get('/design-works/index/like/json/list', function (req, res) {

    var like = new db.mongodb.Collection(db.Client, 'index-like')
    if (require('helper').isLogin(req) === false) {
        res.jsonp(false)
        return
    }

    like.find({owner_id: req.session._id}, {_id: 1, work_id: 1}).toArray(function (err, docs) {
        var idArr = []
        docs.forEach(function (doc) {
            idArr.push(ObjectID(doc.work_id))
        })
        var designWorks = new db.mongodb.Collection(db.Client, 'design-works')
        designWorks.find({_id: {$in: idArr}, status: { $gte : 1}}, {_id: 1, title: 1, content: 1, thumbnails_id: 1}).sort({ts: -1}).toArray(function (err, doc) {
            res.jsonp(doc)
        })
    })
})

//取消喜欢
app.get('/index/unlike', function (req, res) {

    res.end()

    if (require('helper').isLogin(req) === false) {
        return
    }

    try {
        var id = ObjectID(req.query.id)
    } catch (e) {
        res.jsonp({status: -2, err: ['必要的参数不正确']})
        return;
    }

    var like = new db.mongodb.Collection(db.Client, 'index-like')
    var fields = {work_id: req.query.id, owner_id: req.session._id}

    like.remove(fields, {w: 1}, function (err) {
        if (err) console.log('取消喜欢失败，文档为：', fields, Date.now())
        updateLike(id, req.query.type)
    })

})

//检测自己是否已经喜欢过
app.get('/index/liked', function (req, res) {
    if (require('helper').isLogin(req) === false) {
        res.jsonp(false)
        return
    }

    var like = new db.mongodb.Collection(db.Client, 'index-like')

    like.findOne({work_id: req.query.id, owner_id: req.session._id}, {_id: 1}, function (err, docs) {
        res.jsonp(docs ? true : false)
    })

})

//更新喜欢数到design-works.index中
function updateLike(id, type) {

    //只有下方collection方可更新指标
    var allowType = ['design-works', 'article']

    if (allowType.indexOf(type) < 0) {
        console.log('更新喜欢数量时失败，type不合法，type为：' + type)
        return
    }

    //将喜欢的数量汇总到design-works集合中
    var collection = new db.mongodb.Collection(db.Client, type)
    var like = new db.mongodb.Collection(db.Client, 'index-like')

    console.log('开始刷新' + id.toString() + '的喜欢量')

    like.count({work_id: id.toString()}, function (err, count) {
        if (!err && count >= 0) {
            collection.update({_id: id , status:{ $gte : 1 }}, {$set: {'index.like': count}}, {w: 1}, function () {
                console.log('更新' + type + '的：' + id.toString() + '的喜欢到：' + count, Date.now())
            })
        } else {
            console.log('更新喜欢时出错：' + id.toString(), err, Date.now())
        }
    })
}


//返回某个ID的指标
app.get('/index/find', function (req, res) {

    //只有下方collection方可更新指标
    var allowType = ['design-works', 'article']
    var type = req.query.type

    if (allowType.indexOf(type) < 0) {
        res.jsonp({status: -1, err: ['不支持' + type + '的指标查询']})
        return
    }

    try {
        var id = ObjectID(req.query.id)
    } catch (e) {
        res.jsonp({status: -2, err: ['必要的参数不正确']})
        return;
    }

    var collection = new db.mongodb.Collection(db.Client, type)

    collection.findOne({_id: id}, {index: 1}, function (err, result) {
        if (!err && result) {
            res.jsonp(result)
        } else {
            res.jsonp(null)
        }
    })

})
