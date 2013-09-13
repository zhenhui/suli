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


var fileSize = 100 * 1024 * 1000

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

    if (require('helper').isLogin(req) === false) {
        uploadInfo.err.push('请先登陆')
        end()
        return
    }

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

    var ownerID = req.session._id

    var options = {
        chunk_size: 102400,
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
                        //如果是PSD之外的文件，则获取文件描述信息
                        if (format !== 'psd') {
                            console.log('开始获取文件描述信息')
                            gm(file.path).identify(function (err, profile) {
                                if (!err) {
                                    console.log('获取到了文件描述信息')
                                    options.metadata.profile = profile
                                    saveOriginImageFile(file, size)
                                } else {
                                    console.log('读取profile时发生错误', err)
                                    uploadInfo.err.push('读取profileF时发生错误')
                                    end()
                                    unlink(file.path)
                                }
                            })
                        } else {
                            console.log('开始保存原图')
                            saveOriginImageFile(file, size)
                        }
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

        //保存原始文件,原图的标志为：_origin
        var fileName = file.fileId + '_origin' + '_w' + size.width + '_h' + size.height + '.' + file.format
        uploadInfo._id = fileName
        console.log('保存原始文件' + fileName)

        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
        gs.writeFile(file.path, function (err) {
            if (!err) {
                end()
                //预处理图片，以准备生成缩略图
                预处理图片(file)
            } else {
                uploadInfo.err.push('无法保存' + file.name)
                end()
                unlink(file.path)
            }
        })
    }

    //预处理完成后，方可生成各种规格的缩略图文件
    function 预处理图片(file) {

        console.log('开始预处理，图片格式为：' + file.format)

        switch (file.format) {
            //对于jpeg，提供一个原比例90压缩率的版本
            case 'jpg':
                var qualityPath = file.path + '_quality80'
                gm(file.path).noProfile().quality(80).write(qualityPath, function (err) {
                    var fileName = file.fileId + '_quality' + '_w' + file.width + '_h' + file.height + '.' + file.format
                    var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                    gs.writeFile(qualityPath, function (err) {
                        if (!err) {
                            //开始生成并保存各种缩略图
                            resize(file, ownerID)
                            unlink(qualityPath)
                        } else {
                            unlink(file.path)
                        }
                    })
                })
                break;
            //对于gif，不优化直接进行压缩
            case 'gif':
                resize(file, ownerID)
                break;
            case 'psd':
                var dstPath = file.path + '_psd_to_jpg.jpg'
                console.log('开始预处理PSD', file.path)
                gm.subClass({ imageMagick: true })(file.path + '[0]').setFormat('jpg').quality(90).write(dstPath, function (err) {
                    if (!err) {
                        unlink(file.path)
                        file.path = dstPath
                        file.format = 'jpg'
                        var fileName = file.fileId + '_quality' + '_w' + file.width + '_h' + file.height + '.' + file.format
                        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                        gs.writeFile(dstPath, function (err) {
                            if (!err) {
                                //开始生成并保存各种缩略图
                                resize(file, ownerID)
                            } else {
                                uploadInfo.err.push('无法保存' + file.name)
                                unlink(dstPath)
                            }
                        })
                    } else {
                        console.log(err)
                        unlink(file.path)
                    }
                })
                break;
            //直接进行尺寸压缩，不进行任何优化
            case 'png':
                resize(file, ownerID)
                break;

        }
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
    /* ,
     'psd': {
     dstExtName: 'png'
     }*/
}

//缩略图规格
var resizeParam = [
    {
        width: 790,
        quality: 90
    }
]

//对上传的图片生成不同规格的缩略图
function resize(file, ownerID) {

    //过滤掉无意义的宽度（避免小图转换为大图）
    var _resizeParam = resizeParam.filter(function (item) {
        return file.width > item.width
    })

    function _resize() {
        if (_resizeParam.length < 1) {
            unlink(file.path)
            return
        }
        var cur = _resizeParam.shift()

        //生成缩略图并存入库中
        var fileName = file.fileId + '_w_' + cur.width + '_h_' + (cur.height ? cur.height : 'geometric')

        //转换后的图片路径
        var dstSrc = path.join(path.dirname(file.path), fileName).toString() + '.' + file.format

        fileName += '.' + file.format

        console.log('压缩并生成缩略图', '原图：' + file.path, '现在图片：' + file.path)

        switch (file.format) {
            //PSD因为压缩后会生成jpg，所以其实是case 'jpg|psd''
            case 'jpg':
                gm(file.path).resize(cur.width, (cur.height ? cur.height : null)).noProfile().quality(cur.quality).write(dstSrc, function (err) {
                    if (!err) {
                        save(fileName, dstSrc)
                    } else {
                        console.log(err)
                        unlink(dstSrc)
                        _resize()
                    }
                })
                break;
            case 'gif':
                //增加背景色是为了减弱gif的锯齿，类似于ps中的杂边
                //http://imagemagick.org/Usage/anim_mods/
                //Resize with Flatten, A General Solution.
                gm.subClass({ imageMagick: true })(file.path).coalesce().borderColor('white').border(0, 0).resize(cur.width, (cur.height ? cur.height : null)).write(dstSrc, function (err) {
                    if (!err) {
                        save(fileName, dstSrc)
                    } else {
                        console.log(err)
                        unlink(dstSrc)
                        _resize()
                    }
                })
                break;
            case 'png':
                gm(file.path).resize(cur.width, (cur.height ? cur.height : null)).write(dstSrc, function (err) {
                    if (!err) {
                        save(fileName, dstSrc)
                    } else {
                        console.log(err)
                        unlink(dstSrc)
                        _resize()
                    }
                })
                break;
        }

    }

    function save(fileName, path) {
        //获取生成后的图片的实际大小
        gm(path).size(function (err, size) {
            if (!err) {
                var option = {
                    "chunk_size": 10240,
                    metadata: {
                        owner: ownerID,
                        width: size.width,
                        height: size.height
                    }
                }
                var gs = new GridStore(DB.dbServer, fileName, fileName, "w", option)
                gs.writeFile(path, function (err) {
                    if (err) console.log(err)
                    unlink(path)
                    _resize()
                })
            } else {
                unlink(path)
                console.error('无法获取优化后的图片大小')
            }
        })
    }

    _resize()
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
