/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 20:41
 * To change this template use File | Settings | File Templates.
 */


var fs = require('fs')
var DB = require('db')
var path = require('path')
var GridStore = DB.mongodb.GridStore
var ObjectID = DB.mongodb.ObjectID
var gm = require('gm')

var fileSize = 200 * 1024 * 1000

function deleteRequestFile(file) {
    if (Array.isArray(file)) {
        file.forEach(function (f) {
            console.log('删除' + f.path)
            unlink(f.path)
        })
    }
}


exports.saveFile = function (req, res) {

    var uploadInfo = {
        err: []
    }

    if (!req.files || !req.files.file) {
        uploadInfo.err.push('没有接收到文件')
        end()
        return
    }

    if (req.files.file.size < 1 || !req.files.file.name) {
        uploadInfo.err.push('未接收到文件')
        //删除这个0字节的文件
        if (req.files.file.path) unlink(req.files.file.path)
        end()
        return
    }

    var file = Array.isArray(req.files.file) ? req.files.file : [req.files.file]

    if (file.length > 1) {
        deleteRequestFile(file)
        uploadInfo.err.push('一次只允许上传一个文件，您可以分批上传哦。')
        end()
        return
    }

    if (require('helper').isLogin(req) === false) {
        uploadInfo.err.push('请先登陆')
        end()
        deleteRequestFile(file)
        return
    }

    file = file[0]

    //移除冒号，如果用户上传的文件名中，包含:号，则会在以后客户端解析的时候遇到麻烦
    //因为:号在数据库中作为文件ID和真实文件名的分隔符
    file.name = file.name.replace(':', '')

    if (file.size < 1 || file.size > fileSize) {
        uploadInfo.err.push('上传文件的大小不对，上限为' + (fileSize / 1000 / 1024) + 'Mb')
        end()
        return
    }

    //生成一一对应的文件ID
    file.fileId = new ObjectID()

    var options = {
        chunk_size: 1024 * 256 * 10,
        metadata: {
            owner: req.session._id
        }
    }

    //获取文件的后缀名
    var extName = path.extname(file.name).substring(1).toLowerCase()
    if (extName === '') extName = 'unknown'

    console.log('文件名为：' + file.name, '文件扩展名是：' + extName)

    options.metadata.origin_name = file.name
    var fileName = file.fileId + '.' + extName
    uploadInfo._id = fileName + ':' + file.name
    options.metadata.type = "附件"

    var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
    gs.writeFile(file.path, function (err) {
        if (!err) {
            console.log(file.name + '保存成功')
        } else {
            uploadInfo.err.push(fileName + '无法保存')
            console.log(file.name + '保存失败', err)
        }
        unlink(file.path)
        end()
    })


    function end() {
        if (uploadInfo.err.length < 1) {
            delete uploadInfo.err
            uploadInfo.origin_name = file.name
            uploadInfo.size = file.size
        }
        res.header('content-type', 'text/text;charset=utf-8')
        res.end(JSON.stringify(uploadInfo))
    }
}

/*
 //清理各种临时文件
 该方法并不能完全解决问题
 此处应该使用定时程序，来做处理
 */

function unlink(file) {
    if (!file) return
    console.log('正在删除文件：', file)
    fs.unlink(file, function (err) {
        if (!err) {
            console.log('成功删除文件：' + file)
        } else {
            console.error('失败失败：', err, file)
        }
    })
}
