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

exports.saveFile = function (req, res) {

    var uploadInfo = {
        err: []
    }

    if (!req.files || !req.files.file) {
        uploadInfo.err.push('未接收到文件')
        end()
        return
    }

    var file = Array.isArray(req.files.file) ? req.files.file : [req.files.file]

    //虽然本方法每次“只接收”一个文件，但expressjs仍然会接收所有文件放入临时文件夹中
    file = file.filter(function (f) {
        if (f.size <= fileSize) {
            return true
        } else {
            //大于fileSize的文件，直接删除
            fs.unlink(f.path)
            uploadInfo.err.push('不能上传大于' + fileSize + '的文件')
            end()
            return false
        }
    })

    /*if (require('helper').isLogin(req) === false) {
     serverInfo.err.push('请先登陆')
     end()
     return
     }*/

    if (file.length > 1) {
        uploadInfo.err.push('必须且只能上传1个文件')
        end()
        //删除所有临时文件
        file.forEach(function (f) {
            console.log('删除' + f.path)
            unlink(f.path)
        })
        return
    }

    file = file[0]

    if (file.size < 1) {
        uploadInfo.err.push('不允许上传0字节文件')
        end()
        return
    }

    //生成一一对应的文件ID
    file.fileId = new ObjectID()

    var options = {
        chunk_size: 102400,
        metadata: { }
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
                    if (!err && size.width === 200 && size.height === 175) {
                        saveImageFile(file, size)
                        uploadInfo._id = file.fileId
                        end()
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
                _gm = gm(file.path).noProfile().quality(90)
                break;
            //对于gif，不优化直接进行压缩
            case 'gif':
                qualityPath = file.path + '_quality'
                _gm = gm(file.path).noProfile()
                break;
            //直接进行尺寸压缩，不进行任何优化
            case 'png':
                qualityPath = file.path + '_quality'
                _gm = gm(file.path).noProfile()
                break;
        }

        _gm.write(qualityPath, function (err) {
            var fileName = file.fileId + '_quality' + '_w' + size.width + '_h' + size.height + '.' + file.format
            var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
            gs.writeFile(qualityPath, function (err) {
                if (!err) {
                    unlink(qualityPath)
                } else {
                    unlink(file.path)
                }
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
