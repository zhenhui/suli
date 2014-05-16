/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-12
 * Time: 下午9:38
 * To change this template use File | Settings | File Templates.
 */

var DB = require('db')
var helper = require('helper')
var xss = require('xss')
var userIndicators = require('user-indicators')

function _xss(val) {
    return typeof val === 'string' ? xss(val) : val;
}

var tagRe = /^[\u4e00-\u9fa5A-Za-z0-9]{2,}$/
var allowCategory = ['视觉设计', '界面设计', '图标设计']
var objectIdRe = /^[a-z0-9]{24}/

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
        title: _xss(req.body.title),
        content: _xss(req.body.content),
        thumbnails_id: _xss(req.body.thumbnails_id),
        file_id: _xss(req.body['mail-file_id']),
        //指标，喜欢数量，回复数量
        //喜欢和回复有单独的集合，在这里存储是为了增加冗余后提高查询性能
        index: {
            like: 0,
            view: 0,
            comment: 0
        },
        category: _xss(req.body.category),
        tag: _xss(req.body.tag),
        type: 'own',
        owner_id: req.session._id,
        owner_user: req.session.user,
        //状态，>0表示可用的作品，负为删除或禁用的作品
        status: 1,
        ts: Date.now()
    }

    //检测各种异常情况
    if (typeof data.title !== 'string' || data.title.trim().length > 60 || data.title.trim().length < 1) {
        result.err.push('标题长度不符合要求')
    }

    if (typeof data.content !== 'string' || data.content.trim().length > 200 || data.content.trim().length < 1) {
        result.err.push('内容长度必须在0-200之内')
    }

    if (typeof data.thumbnails_id !== 'string' || data.thumbnails_id.length < 1) {
        result.err.push('您必须上传缩略图')
    }

    if (typeof data.tag === 'string') {
        data.tag = data.tag.split(' ').filter(function (item) {
            return item !== '' && tagRe.test(item)
        })
        if (data.tag.length > 16) {
            result.err.push('标签最多只能写16个')
        }
    }

    if (typeof data.file_id !== 'string' || data.file_id.length < 25) {
        result.err.push('您必须上传主图')
    }

    //作品分类

    if (allowCategory.indexOf(data.category) < 0) {
        result.err.push('请选择作品分类')
        result.errType = 'category'
    }

    if (result.err.length > 0) {
        //-1     参数错误
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

        //检查是否有上传共享作品的权限
        if (data.type === 'share' && group.indexOf('上传共享作品') < 0) {
            result.status = -2
            result.err.push('您没有上传共享作品的权限')
            res.json(result)
            return
        }

        //检查是否有上传共享作品的权限
        if (data.type === 'own' && group.indexOf('上传个人作品') < 0) {
            result.status = -2
            result.err.push('您没有上传个人作品的权限')
            res.json(result)
            return
        }

        console.log('开始保存作品,owner:' + req.session._id)
        var share = new DB.mongodb.Collection(DB.Client, 'design-works')
        share.insert(data, {safe: true}, function (err, docs) {
            if (!err && docs.length > 0) {
                res.json({status: 1, docs: docs[0]})

                //更新作品
                userIndicators.update(req.session._id, 'design-works')


                //将gs中图片文件的temp标记remove
                //否则,文件会被标记为临时文件,将会被清理程序处理掉
                var files = new DB.mongodb.Collection(DB.Client, 'fs.files')


                var fileId = []

                if (objectIdRe.test(data.thumbnails_id)) fileId.push(data.thumbnails_id.substring(0, 24))
                if (objectIdRe.test(data.file_id)) fileId.push(data.file_id.substring(0, 24))

                if (fileId.length > 0) {
                    files.update({
                            filename: new RegExp(fileId.join('|')),
                            'metadata.owner': req.session._id
                        }, {$unset: {'metadata.temp': 1}},
                        { w: 1, multi: true }, function (err, numberUpdated) {
                            if (err) {
                                console.log('Fail 无法去掉temp标记', fileId.join(','))
                            } else {
                                console.log('success: 成功去除' + numberUpdated + '个temp标记', fileId.join(','))
                            }
                        })
                }


            } else {
                res.json({status: -10, err: '无法保存共享，请联系管理员'})
            }
        })
    })
}
