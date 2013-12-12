/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-4
 * Time: 上午10:49
 * To change this template use File | Settings | File Templates.
 */


var fs = require('fs')
var DB = require('db')
var path = require('path')
var GridStore = DB.mongodb.GridStore
var ObjectID = DB.mongodb.ObjectID
var gm = require('gm')


var fileSize = 50 * 1024 * 1000

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

//移除此次请求中所有的上传文件
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
            owner: ownerID
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
                    if (!err) {
                        console.log('开始尝试获取文件描述信息')
                        gm(file.path).identify(function (err, profile) {
                            if (!err) {
                                console.log('获取到了文件描述信息')
                                options.metadata.profile = profile
                                options.metadata.width = size.width
                                options.metadata.height = size.height
                                saveOriginImageFile(file, size)
                            } else {
                                console.log('读取profile时发生错误', err)
                                uploadInfo.err.push('读取profileF时发生错误')
                                end()
                                unlink(file.path)
                            }
                        })
                    } else {
                        console.log('无法获取文件的尺寸', err)
                        uploadInfo.err.push('无法获取文件的尺寸')
                        end()
                        unlink(file.path)
                    }
                })


            } else {
                console.log('无效的图片文件', err)
                uploadInfo.err.push('无效的图片文件')
                unlink(file.path)
                end()
            }
        })
    } else {
        //其它格式，直接进行转换
        uploadInfo.err.push('只允许上传图片，不支持')
        unlink(file.path)
        end()
    }


    //保存图片的原始数据
    function saveOriginImageFile(file, size) {

        file.width = size.width
        file.height = size.height

        options.metadata.origin_name = file.name.substring(0, file.name.lastIndexOf('.') + 1) + file.format
        options.metadata.type = "原图"
        var fileName = file.fileId + '_origin.' + file.format
        console.log('保存原始文件' + fileName)

        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
        gs.writeFile(file.path, function (err) {
            if (!err) {
                save90(file)
            } else {
                uploadInfo.err.push('无法保存' + file.name)
                end()
                unlink(file.path)
            }
        })
    }

    //保存一个790或内的80%质量图片
    function save90(file) {

        var quality90Path = file.path + '_quality90'

        var qualityImg

        switch (file.format) {
            //对于jpeg，提供一个原比例90压缩率的版本
            case 'jpg':
                qualityImg = gm(file.path).interlace('Line').noProfile().quality(90)
                break;
            //对于gif，不优化直接进行压缩
            case 'gif':
                qualityImg = gm.subClass({ imageMagick: true })(file.path).coalesce().borderColor('white').border(0, 0)
                break;
            case 'png':
                qualityImg = gm(file.path).interlace('Line')
                break;
        }

        //保存一个790的优化图片版本
        if (file.width > 790) {
            console.log('图片大于790,因此添加resize')
            qualityImg = qualityImg.resize(790)
        }

        qualityImg.write(quality90Path, function (err) {
            if (err) {
                uploadInfo.err.push('无法保存优化后的图片' + file.name)
                unlink(file.path)
                end()
                return
            }
            gm(quality90Path).size(function (err, size) {
                if (err) {
                    uploadInfo.err.push('无法获取80%质量的原图')
                    unlink(file.path)
                    end()
                    return
                }
                var fileName = file.fileId + '_quality_' + size.width + 'x' + size.height + '.' + file.format
                options.type = '优化后的原图'
                var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                gs.writeFile(quality90Path, function (err) {
                    if (!err) {
                        uploadInfo._id = fileName + ':' + file.name
                        end()
                        saveFull(file)
                    } else {
                        uploadInfo.err.push('无法写入优化后的原图' + file.name)
                        unlink(file.path)
                    }
                    unlink(quality90Path)
                })
            })
        })
    }


    //保存一个原尺寸但优化后的图片
    function saveFull(file) {
        //保存一个90%质量的原尺寸图片
        var fullPath = file.path + '_quality90'

        var fullImg

        switch (file.format) {
            //对于jpeg，提供一个原比例90压缩率的版本
            case 'jpg':
                fullImg = gm(file.path).interlace('Line').noProfile().quality(80)
                break;
            //对于gif，不优化直接进行压缩
            case 'gif':
                fullImg = gm.subClass({ imageMagick: true })(file.path).coalesce().borderColor('white').border(0, 0)
                break;
            case 'png':
                fullImg = gm(file.path).interlace('Line')
                break;
        }

        fullImg.write(fullPath, function (err) {
            if (err) {
                console.log('无法写入全尺寸并优化后的原图' + file.name)
                unlink(file.path)
                return
            }
            var fileName = file.fileId + '_full' + '_' + file.width + 'x' + file.height + '.' + file.format
            options.type = '优化后的全尺寸'
            var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
            gs.writeFile(fullPath, function (err) {
                if (err) {
                    console.log('无法在gs中写入全尺寸+优化后的原图' + file.name)
                }
                unlink(file.path)
                unlink(fullPath)
            })
        })
    }

    function end() {
        if (uploadInfo.err.length < 1) {
            delete uploadInfo.err
            uploadInfo.origin_name = file.name
            uploadInfo.size = file.size
        }
        res.header('content-type', 'text/text;charset=utf-8')
        res.end(JSON.stringify(uploadInfo))
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
}
