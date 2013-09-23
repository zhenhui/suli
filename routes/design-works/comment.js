/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-21
 * Time: 下午4:57
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var DB = require('db')
var ObjectID = DB.mongodb.ObjectID


app.post('/design-works/comment/new', function (req, res) {

    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.json(result)
        return
    }

    //检验数据合法性
    var data = {
        //针对哪个作品的id
        'work_id': req.body._id,
        content: req.body.content,
        owner: req.session._id,
        owner_name: req.session.name,
        //1表示正常状态的评论
        status: 1,
        ts: Date.now()
    }

    //作品ID是否正确
    try {
        var id = ObjectID(data.work_id)
    } catch (e) {
        result.err.push('参数非法')
        result.status = -2
        res.json(result)
        return
    }

    if (!data.content || data.length < 1) {
        result.err.push('请输入评论内容')
        result.status = -3
        res.json(result)
        return
    }

    var works = new DB.mongodb.Collection(DB.Client, 'design-works')
    var comment = new DB.mongodb.Collection(DB.Client, 'design-works-comment')

    works.findOne({_id: id, status: {$gte: 1}}, {_id: 1}, function (err, docs) {
        console.log(docs, id, id.valueOf())
        if (!err && docs) {
            comment.insert(data, {safe: true}, function (err, docs) {
                if (!err && docs.length > 0) {
                    res.json({docs: docs[0]})
                } else {
                    result.err.push('无法保存评论')
                    result.status = -6
                    res.json(result)
                }
            })
        } else {
            result.err.push('作品不存在或不可用')
            result.status = -5
            res.json(result)
        }
    })
})


//获取某条作品的评论
app.get('/design-works/comment/list', function (req, res) {

    var result = {err: []}
    var _id = req.query.id
    try {
        //检测是否为合法的ObjectId
        //用正则更好？
        ObjectID(_id)
    } catch (e) {
        result.err.push('非法参数')
        result.status = -1
        res.json(result)
        return
    }

    //仍用字符串
    _id = req.query.id

    var page = parseInt(req.query.page, 10)
    if (isNaN(page) || page < 1) {
        result.err.push('当前页码必须是一个数字')
        res.status = -2
        res.end()
        res.json(result)
        return
    }

    //每页条数
    var per_page = parseInt(req.query.per_page, 10)
    if (isNaN(per_page) || per_page < 1 || per_page > 100) {
        result.err.push('每页数量请限定在1-100之间')
        result.status = -3
        res.json(result)
        return
    }

    var comment = new DB.mongodb.Collection(DB.Client, 'design-works-comment')

    var filter = {work_id: _id, status: {$gte: 1}}
    comment.count(filter, function (err, count) {
        if (!err && count > 0) {
            comment.find(filter).sort({ts: -1}).skip((page == 1 ? 0 : (page - 1) * per_page)).limit(per_page).toArray(function (err, docs) {
                if (!err) {
                    if (docs && docs.length > 0) {
                        res.jsonp({
                            status: 'ok',
                            //总条数
                            total_count: count,
                            //总页数
                            total_page: Math.ceil(count / per_page),
                            //当前页
                            page: page,
                            //每页显示多少条
                            per_page: per_page,
                            docs: docs
                        })
                    } else {
                        res.jsonp({
                            status: 'empty',
                            err: '无记录'
                        })
                    }
                } else {
                    res.jsonp({
                        status: 'fail',
                        err: '查询中出现错误'
                    })
                }
            })
        } else {
            res.jsonp({
                status: 'empty',
                err: '无任何记录'
            })
        }
    })
})
