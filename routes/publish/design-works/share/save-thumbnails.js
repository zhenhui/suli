/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */


var fs = require('fs')
var DB = require('db')
var path = require('path')
var GridStore = DB.mongodb.GridStore
var ObjectID = DB.mongodb.ObjectID
var gm = require('gm')
var app = require('app')


var fileSize = 10 * 1024 * 1000

//缩略图规格
var resizeParam = [
    {
        width: 230,
        height: 175,
        quality: 90
    },
    {
        width: 100,
        height: 76,
        quality: 90
    },
    {
        width: 66,
        height: 50,
        quality: 90
    }
]

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
            type: '作品缩略图'
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
                    saveImageFile(file, size)
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
            //对于jpeg进行90%质量压缩
            case 'jpg':
                qualityPath = file.path + '_quality90'
                //所有图片使用渐进式方式
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
                _gm = gm(file.path).noProfile()
                break;
        }

        _gm.resize(460, 350, '!').write(qualityPath, function (err) {
                if (!err) {
                    var fileName = file.fileId + '_' + size.width + 'x' + size.height + '.' + file.format
                    var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                    gs.writeFile(qualityPath, function (err) {
                        if (!err) {
                            //此ID用作返回给客户端
                            uploadInfo._id = file.fileId + '_' + resizeParam[0].width + 'x' + resizeParam[0].height + '.' + file.format
                            console.log('成功保存原图' + fileName)
                        } else {
                            uploadInfo.err.push('无法保存优化后的图片到数据库中')
                        }
                        resize(file, ownerID)
                        end()
                        unlink(qualityPath)
                    })
                } else {
                    uploadInfo.err.push('无法保存优化后的图片到磁盘')
                    end()
                    unlink(qualityPath)
                    unlink(file.path)
                }
            }
        )
    }

    function end() {
        if (uploadInfo.err.length < 1) {
            delete uploadInfo.err
            uploadInfo.size = file.size
        }
        res.header('content-type', 'text/text;charset=utf-8')
        res.end(JSON.stringify(uploadInfo))
    }

    function resize(file, ownerID) {

        //过滤掉无意义的宽度（避免小图转换为大图）
        var _resizeParam = resizeParam.slice()

        var cur

        function _resize() {
            if (_resizeParam.length < 1) {
                unlink(file.path)
                return
            }
            cur = _resizeParam.shift()

            //生成缩略图并存入库中
            var fileName = file.fileId + '_' + cur.width + 'x' + cur.height + '.' + file.format

            //转换后的图片路径
            var dstSrc = path.join(path.dirname(file.path), fileName).toString() + '.' + file.format

            console.log('压缩并生成缩略图', '原图：' + file.path, '现在图片：' + file.path)

            switch (file.format) {
                //PSD因为压缩后会生成jpg，所以其实是case 'jpg|psd''
                case 'jpg':
                    gm(file.path).resize(cur.width, cur.height, '!').interlace('Line').noProfile().quality(cur.quality).write(dstSrc, function (err) {
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
                    gm.subClass({ imageMagick: true })(file.path).coalesce().borderColor('white').border(0, 0).resize(cur.width, cur.height, '!').write(dstSrc, function (err) {
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
                    gm(file.path).resize(cur.width, cur.height, '!').write(dstSrc, function (err) {
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
                        "chunk_size": 1024 * 256 * 10,
                        metadata: {
                            owner: ownerID,
                            width: size.width,
                            height: size.height,
                            type: "作品缩略图"
                        }
                    }
                    var gs = new GridStore(DB.dbServer, fileName, fileName, "w", option)
                    gs.writeFile(path, function (err) {
                        if (!err) {
                            _resize()
                        } else {
                            uploadInfo.err.push('无法保存' + path + '文件名为：' + fileName)
                            end()
                        }
                        unlink(path)
                    })
                } else {
                    unlink(path)
                    console.error('无法获取优化后的图片大小')
                }
            })
        }

        _resize()
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
