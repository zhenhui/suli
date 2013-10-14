/**
 * Created by 松松 on 13-10-14.
 */

var DB = require('db')
var helper = require('helper')
var xss = require('xss')

function trim(str) {
    return typeof str === 'string' ? str.trim() : ''
}

exports.save = function (req, res) {
    var result = {
        err: []
    }

    if (require('helper').isLogin(req) === false) {
        result.err.push('未登陆')
        //-10代表未登陆
        result.status = -10
        res.json(result)
        return
    }

    var data = {
        title: xss(trim(req.body.title)),
        content: xss(trim(req.body.content)),
        thumbnails_id: xss(trim(req.body.thumbnails_id)),
        category: xss(trim(req.body.category)),
        tag: xss(trim(req.body.tag)),
        owner_id: req.session._id,
        //1:发布状态，-1草稿状态
        status: parseInt(req.body.status, 10),
        ts: Date.now()
    }

    //检测各种异常情况
    if (typeof data.title !== 'string' || data.title.trim().length > 20 || data.title.trim().length < 1) {
        result.err.push('标题长度不符合要求')
    }

    if (typeof data.content !== 'string' || data.content.trim().length > 20000 || data.content.trim().length < 1) {
        result.err.push('内容长度必须在0-20000之内')
    }

    if (typeof data.thumbnails_id !== 'string') {
        result.err.push('您必须上传缩略图')
    }
    if (typeof data.category !== 'string') {
        result.err.push('您必须选择文章的所属类型')
    }

    if (typeof data.tag === 'string') {
        data.tag = data.tag.split(' ').filter(function (item) {
            return item !== ''
        })
    }
    if (isNaN(data.status)) {
        result.err.push('您没有选择发布类型')
    }

    if (result.err.length > 0) {
        //-1 参数错误
        result.status = -1
        res.json(result)
        return
    }


    helper.getGroup(req, function (group) {
        if (Array.isArray(group) === false) {
            result.status = -2
            result.err.push('无法获取权限信息')
            res.json(result)
            return
        }

        if (group.indexOf('发布文章') < 0) {
            result.status = -2
            result.err.push('您没有发布文章的权限')
            res.json(result)
            return
        }

        var article = new DB.mongodb.Collection(DB.Client, 'article')
        article.insert(data, {safe: true}, function (err, docs) {
            if (!err && docs.length > 0) {
                res.json({status: 1, docs: docs[0]})
            } else {
                res.json({status: -10, err: '无法保存共享，请联系管理员'})
            }
        })
    })
}
