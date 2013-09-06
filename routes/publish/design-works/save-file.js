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


//最大只允许上传150MB的文件
var fileSize = 150 * 1024 * 1000

exports.saveFile = function (req, res) {

    var serverInfo = {
        err: []
    }

    if (!req.files || !req.files.file) {
        serverInfo.err.push('未接收到文件')
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
            serverInfo.err.push('不能上传大于' + fileSize + '的文件')
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
        serverInfo.err.push('必须且只能上传1个文件')
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
        serverInfo.err.push('不允许上传0字节文件')
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

                console.log(file.name + '是合法的图片文件，源图格式为：' + extName, '当前格式为：' + file.format)

                //将图片的方向旋转正确，并且获取文件的尺寸
                gm(file.path).autoOrient().size(function (err, size) {

                    if (!err) {
                        file.width = size.width
                        file.height = size.height
                        //文件的真实格式
                        file.format = format

                        console.log('有效的图片文件，原始扩展名' + extName, '真实扩展名' + file.format)

                        options.metadata.origin_name = file.name.substring(0, file.name.lastIndexOf('.') + 1) + file.format
                        options.metadata.ext = file.format

                        options.metadata.width = file.width
                        options.metadata.owner = req.session._id
                        options.metadata.height = file.height

                        //将meta信息发送会浏览器端
                        serverInfo.metadata = {
                            width: file.width,
                            height: file.height,
                            ext: file.format
                        }

                        //保存原始文件,原图的标志为：_origin
                        var fileName = file.fileId + '_origin' + '_w' + file.width + '_h' + file.height + '.' + file.format
                        serverInfo._id = fileName
                        console.log('保存原始文件' + fileName)
                        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                        gs.writeFile(file.path, function (err) {
                            if (!err) {
                                //开始生成并保存各种缩略图
                                resize(file)
                                end()
                            } else {
                                serverInfo.err.push('无法保存' + file.name)
                                unlink(file.path)
                                end()
                            }
                        })
                    } else {
                        console.log('无效的图片文件', err)
                        serverInfo.err.push('无效的图片文件')
                        unlink(file.path)
                        end()
                    }
                })
            } else {
                console.log('无效的图片文件', err)
                serverInfo.err.push('无效的图片文件')
                unlink(file.path)
                end()
            }
        })
    } else {
        //其它格式，直接进行转换
        saveOriginFile()
    }

    function end() {
        if (serverInfo.err.length < 1) {
            delete serverInfo.err
            serverInfo.origin_name = file.name
            serverInfo.size = file.size
        }
        res.end(JSON.stringify(serverInfo, undefined, '    '))
    }

    function saveOriginFile() {
        console.log('非图片格式，直接进行保存，文件类型是：' + extName)
        options.metadata.origin_name = file.name
        var fileName = file.fileId + '.' + extName
        serverInfo._id = fileName
        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
        /*  gs.writeFile(files.path, function (err) {
         if (!err) {
         console.log(files.name + '保存成功')
         } else {
         serverInfo.err.push(fileName + '无法保存')
         console.log(files.name + '保存失败', err)
         }
         end()
         })*/


    }
}

var allowFile = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png'
}


//各种规格
var resizeParam = [
    {
        width: 20,
        height: 20,
        quality: 60
    } ,
    {
        width: 30,
        height: 30,
        quality: 60
    },
    {
        width: 55,
        height: 55,
        quality: 60
    },
    {
        width: 80,
        height: 80,
        quality: 60
    },
    {
        width: 190,
        height: 70,
        quality: 60
    } ,
    {
        width: 230,
        height: 175,
        quality: 80
    } ,
    {
        width: 790,
        quality: 90
    }
]

//对上传的图片生成不同规格的缩略图
function resize(file) {

    //过滤掉无意义的宽度（避免小图转换为大图）
    var _resizeParam = resizeParam.filter(function (item) {
        return file.width > item.width
    })

    function _resize() {
        if (_resizeParam.length < 1) {
            // unlink(file.path)
            return
        }
        var cur = _resizeParam.shift()

        //生成缩略图并存入库中
        var fileName = file.fileId + '_w' + cur.width + '_h' + cur.height + '.' + file.format

        //生成图片后的路径
        var dstSrc = path.join(path.dirname(file.path), fileName).toString()

        //生成缩略图，并且为60%的质量
        gm(file.path).resize(cur.width, (cur.height ? cur.height : null)).noProfile().quality(cur.quality).write(dstSrc, function (err) {
            if (!err) {
                var gs = new GridStore(DB.dbServer, fileName, fileName, "w", {
                    "chunk_size": 10240
                })
                gs.writeFile(dstSrc, function (err) {
                    if (err) console.log(err)
                    //  unlink(dstSrc)
                    _resize()
                })
            } else {
                console.log(err)
                //  unlink(dstSrc)
                _resize()
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
    fs.unlink(file, function (err) {
        if (!err) {
            console.log(file + '\t already unlink')
        } else {
            console.log('unlink fail', err, file)
        }
    })
}

var app = require('app')

app.post('/publish/design-works/save-file', exports.saveFile)
