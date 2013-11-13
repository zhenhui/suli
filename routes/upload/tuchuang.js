/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-10-30
 * Time: 下午16:38
 * To change this template use File | Settings | File Templates.
 */



var fs = require('fs')
var DB = require('db')
var path = require('path')
var GridStore = DB.mongodb.GridStore
var ObjectID = DB.mongodb.ObjectID
var gm = require('gm')
var app = require('app')

var fileSize = 501 * 1024

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

    if (!req.files || !req.files.file || req.files.file.size < 1 || !req.files.file.name) {
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

    if (file.size < 1 || file.size > fileSize) {
        uploadInfo.err.push('上传文件的大小不对，上限为' + (fileSize / 1024) + 'Kb')
        end()
        return
    }

    //生成一一对应的文件ID
    file.fileId = new ObjectID()

    var ownerID = req.session._id

    var options = {
        chunk_size: 1024 * 256 * 10,
        metadata: {
            owner: ownerID,
            type: '图床'
        }
    }

    //获取文件的后缀名
    var extName = path.extname(file.name).substring(1).toLowerCase()
    if (extName === '') extName = 'unknown'

    console.log('文件名为：' + file.name, '文件扩展名是：' + extName)

    if (allowFile[extName]) {
        //检查是否为有效图片
        console.log('开始对' + file.name + '文件进行合法性效验')
        console.log(file.path)
        gm(file.path).format(function (err, format) {
            //如果是允许上传的图片文件
            if (!err && allowFile[format.toLowerCase()]) {

                format = format.toLowerCase()

                if (format === 'jpg' || format === 'jpeg') format = 'jpg'

                file.format = format
                console.log('图片格式为' + format, '开始获取文件大小')

                var fileName = file.fileId + '.' + format

                var noProfilePath = file.path + '_noProfile'
                gm(file.path).noProfile().write(noProfilePath, function (err) {
                    if (err) {
                        uploadInfo.err.push('无法生成优化后的图片')
                        end()
                        unlink(file.path)
                        unlink(noProfilePath)
                        return
                    }
                    var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                    gs.writeFile(noProfilePath, function (err) {
                        if (!err) {
                            uploadInfo._id = fileName
                        } else {
                            uploadInfo.err.push('无法保存优化后的图片到数据库中')
                            end()
                            unlink(file.path)
                            unlink(noProfilePath)
                            return
                        }
                        //Save preview 138
                        gm(file.path).noProfile().resize(138).write(noProfilePath, function () {

                            options.metadata.type = "tuchuang_preview"

                            var gs = new GridStore(DB.dbServer, fileName + '_preview', fileName + '_preview', "w", options)
                            gs.writeFile(noProfilePath, function (err) {
                                if (err) {
                                    uploadInfo.err.push('无法保存缩略图')
                                }
                                unlink(noProfilePath)
                                unlink(file.path)
                                end()
                            })
                        })
                    })
                })
            } else {
                console.log('文件看起来不是一个图像格式', err)
                uploadInfo.err.push('文件看起来不是一个图像格式')
                unlink(file.path)
                end()
            }
        })
    } else {
        console.log('无效的图片文件')
        uploadInfo.err.push('无效的图片文件')
        unlink(file.path)
        end()
    }

    function end() {
        if (uploadInfo.err.length < 1) {
            delete uploadInfo.err
            uploadInfo.origin_name = file.name
            uploadInfo.size = file.size
        }
        res.header('content-type', 'text/html;charset=utf-8')

        console.log(req.body, {
            callback: req.body['callback-func-name'],
            result: JSON.stringify(uploadInfo)
        })

        res.render('upload/tuchuangIframeCallBack', {
            callback: req.body['callback-func-name'],
            result: JSON.stringify(uploadInfo)
        })
    }
}

var allowFile = {
    'jpg': {
        dstExtName: 'jpg'
    },
    'jpeg': {
        dstExtName: 'jpg'
    },
    'gif': {
        dstExtName: 'gif'
    },
    'png': {
        dstExtName: 'png'
    }
}

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

app.post('/upload/tuchuang', exports.saveFile)


//Find tuchuang list for current user
app.get('/tuchuang/list', function (req, res) {
    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.err.push('请先登陆')
        res.json(result)
        return
    }
    var file = new DB.mongodb.Collection(DB.Client, 'fs.files')
    file.find({"metadata.owner": req.session._id, "metadata.type": "图床"}, {id: 1}).sort({uploadDate: -1}).toArray(function (err, docs) {
        if (!err) {
            delete result.err
            result.data = docs
        } else {
            result.err.push('Find tuchuang list fail')
        }
        res.json(result)
    })
})