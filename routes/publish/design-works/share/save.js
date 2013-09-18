/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-12
 * Time: 下午9:38
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs')
var DB = require('db')

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
        title: req.body.title,
        content: req.body.content,
        thumbnails_id: req.body.thumbnails_id,
        file_id: req.body['mail-file_id'],
        ps_id: req.body.ps_id,
        category: req.body.category,
        tag: req.body.tag,
        type: req.body.type,
        owner: req.session._id,
        ts: Date.now()
    }

    //检测各种异常情况
    if (typeof data.title !== 'string' || data.title.trim().length > 20 || data.title.trim().length < 1) {
        result.err.push('标题长度不符合要求')
    }

    if (typeof data.content !== 'string' || data.content.trim().length > 200 || data.content.trim().length < 1) {
        result.err.push('内容长度必须在0-200之内')
    }

    if (typeof data.thumbnails_id !== 'string') {
        result.err.push('您必须上传缩略图')
    }

    if (typeof data.ps_id === 'string') {
        data.ps_id = data.ps_id.split(/[\r\n]/gmi).filter(function (item) {
            return item.trim().length > 0
        })
        if (data.ps_id.length > 3) {
            result.err.push('超过上传文件的上限')
        }
    }

    if (typeof data.tag === 'string') {
        data.tag = data.tag.split(' ').filter(function (item) {
            return item !== ''
        })
    }

    if (typeof data.file_id !== 'string') {
        result.err.push('您必须上传主图')
    }

    if (typeof data.file_id !== 'string') {
        result.err.push('您必须上传主图')
    }

    //作品分类
    switch (data.category) {
        case '视觉设计':
            data.category = '视觉设计'
            break;
        case '交互设计':
            data.category = '交互设计'
            break;
        default:
            data.category = '未分类'
            break;
    }

    //作品共享&个人
    //share共享
    //own个人
    switch (data.type) {
        case 'share':
            data.type = 'share'
            break;
        case 'own':
            data.type = 'own'
            break;
        case undefined:
            data.type = 'own'
            break;
        default:
            data.type = 'own'
            break;
    }

    if (result.err.length > 0) {
        res.json(result)
        return
    }

    var share = new DB.mongodb.Collection(DB.Client, 'design-works')
    share.insert(data, {safe: true}, function (err, docs) {
        if (!err && docs.length > 0) {
            res.json({docs: docs[0]})
        } else {
            res.json({err: '无法保存共享，请联系管理员'})
        }
    })

}