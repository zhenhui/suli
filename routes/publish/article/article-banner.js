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


var fileSize = 10 * 1024 * 1000

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

    //移除冒号，如果用户上传的文件名中，包含:号，则会在以后客户端解析的时候遇到麻烦
    //因为:号在数据库中作为文件ID和真实文件名的分隔符
    file.name = file.name.replace(':', '')

    if (file.size < 1 || file.size > fileSize) {
        uploadInfo.err.push('上传文件的大小不对，上限为' + (fileSize / 1024) + 'Kb')
        end()
        return
    }

    //生成一一对应的文件ID
    file.fileId = new ObjectID()

    var options = {
        chunk_size: 1024 * 256 * 10,
        metadata: {
            owner: req.session._id,
            type: '文章首部Banner'
        }
    }

    //获取文件的后缀名
    var extName = path.extname(file.name).substring(1).toLowerCase()
    if (extName === '') extName = 'unknown'

    console.log('文件名为：' + file.name, '文件扩展名是：' + extName)

    if (allowFile[extName]) {
        //检查是否为有效图片
        console.log('开始对' + file.name + '文件进行合法性效验')
        gm(file.path).format(function (err, format) {
            //如果是允许上传的图片文件
            if (!err && allowFile[format.toLowerCase()]) {

                format = format.toLowerCase()

                if (format === 'jpg' || format === 'jpeg') format = 'jpg'

                file.format = format

                console.log('图片格式为' + format, '开始获取文件大小')

                //获取大小
                gm(file.path).size(function (err, size) {
                    if (!err && size.width === 770 && size.height === 200) {
                        saveImageFile(file, size)
                    } else {
                        console.log('尺寸不正确', err)
                        uploadInfo.err.push('尺寸不正确')
                        end()
                        unlink(file.path)
                    }
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

    //保存图片的原始数据
    function saveImageFile(file, size) {
        var _gm
        var qualityPath
        switch (file.format) {
            //对于jpeg，提供一个原比例90压缩率的版本
            case 'jpg':
                qualityPath = file.path + '_quality90'
                _gm = gm(file.path).interlace('Line').noProfile().quality(90)
                break;
            //对于gif，不优化直接进行压缩
            case 'gif':
                qualityPath = file.path + '_quality'
                _gm = gm(file.path).noProfile()
                break;
            //直接进行尺寸压缩，不进行任何优化
            case 'png':
                qualityPath = file.path + '_quality'
                _gm = gm(file.path).interlace('Line').noProfile()
                break;
        }

        _gm.write(qualityPath, function (err) {
            var fileName = file.fileId + '_' + '_' + size.width + 'x' + size.height + '.' + file.format
            var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
            gs.writeFile(qualityPath, function (err) {
                if (!err) {
                    uploadInfo._id = fileName
                } else {
                    uploadInfo.err.push('无法保存优化后的图片')
                }
                end()
                unlink(qualityPath)
                unlink(file.path)
            })
        })

    }

    function end() {
        if (uploadInfo.err.length < 1) {
            delete uploadInfo.err
            uploadInfo.origin_name = file.name
            uploadInfo.size = file.size
        }
        res.end(JSON.stringify(uploadInfo, undefined, '    '))
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
