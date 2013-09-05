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
var im = require('imagemagick')
var GridStore = DB.mongodb.GridStore
var ObjectID = DB.mongodb.ObjectID

//最大只允许上传150MB的文件
var fileSize = 150 * 1024 * 1000

exports.saveFile = function (req, res) {

    res.header('Content-Type', 'text/jsoncharset=utf-8')

    var files = Array.isArray(req.files.file) ? req.files.file : [req.files.file]

    var tempFile = []

    var serverInfo = {
        err: []
    }

    //虽然本方法每次“只接收”一个文件，但expressjs仍然会接收所有文件放入临时文件夹中
    files = files.filter(function (f) {
        if (f.size <= fileSize) {
            tempFile.push(f.path)
            return true
        } else {
            //大于fileSize的文件，直接删除
            fs.unlink(f.path)
            serverInfo.err.push('不能上传大于' + fileSize + '的文件')
            return false
        }
    })

    if (require('helper').isLogin(req) === false) {
        serverInfo.err.push('请先登陆')
        end()
        return
    }

    if (files.length !== 1) {
        serverInfo.err.push('必须且只能上传1个文件')
        end()
        return
    }

    files = files[0]

    if (files.size < 1) {
        serverInfo.err.push('不允许上传0字节文件')
        end()
        return
    }

    var fileInfo = {}
    //生成一一对应的文件ID
    files.fileId = new ObjectID()

    fileInfo.name = files.name
    fileInfo.path = path.basename(files.path)

    var options = {
        chunk_size: 102400,
        metadata: { }
    }

    //如果上传的是图片
    var extName = path.extname(files.name).substring(1).toLowerCase()
    if (extName === '') extName = 'unknown'

    console.log('文件名为：' + files.name, '文件扩展名是：' + extName)

    if (allowFile[extName]) {
        //检查是否为有效图片
        console.log('开始对' + files.name + '文件进行合法性效验')
        im.identify(['-format', '%wx%hx%m', files.path + '[0]'], function (err, output) {
                if (!err) {
                    console.log(files.name + '通过合法性效验')
                    output = output.trim().split('x')

                    files.width = parseInt(output[0], 10)
                    files.height = parseInt(output[1], 10)
                    //文件的真实格式
                    files.format = output[2].toLowerCase()

                    console.log('有效的图片文件，原始扩展名' + extName, '真实扩展名' + files.format)

                    options.metadata.origin_name = files.name.substring(0, files.name.lastIndexOf('.') + 1) + files.format
                    options.metadata.ext = files.format

                    options.metadata.width = files.width
                    options.metadata.owner = req.session._id
                    options.metadata.height = files.height

                    //将meta信息发送会浏览器端
                    serverInfo.metadata = {
                        width: files.width,
                        height: files.height,
                        ext: files.format
                    }

                    //保存原始文件
                    var fileName = files.fileId + '_w' + files.width + '_h' + files.height + '.' + files.format
                    serverInfo._id = fileName
                    var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
                    gs.writeFile(files.path, function (err) {
                        if (!err) {
                            end()
                            console.log('c', Date.now())
                        } else {
                            serverInfo.err.push('无法保存' + files.name)
                            end()
                        }
                    })
                } else {
                    console.log('无效的图片文件', err)
                    serverInfo.err.push('无效的图片文件')
                    end()
                }
            }
        )
    } else {
        //其它格式，直接进行转换
        saveOriginFile()
    }

    function end() {
        if (serverInfo.err.length < 1) {
            delete serverInfo.err
            serverInfo.origin_name = files.name
            serverInfo.size = files.size
        }
        res.end(JSON.stringify(serverInfo, undefined, '    '))
        unlink(tempFile)
    }

    function saveOriginFile() {
        console.log('非图片格式，直接进行保存，文件类型是：' + extName)
        options.metadata.origin_name = files.name
        var fileName = files.fileId + '.' + extName
        serverInfo._id = fileName
        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options)
        gs.writeFile(files.path, function (err) {
            if (!err) {
                console.log(files.name + '保存成功')
            } else {
                serverInfo.err.push(fileName + '无法保存')
                console.log(files.name + '保存失败', err)

            }
            end()
        })
    }
}

var allowFile = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png'
}

/*
 该方法并不能完全解决问题
 此处应该使用定时程序，来做处理
 */

function unlink(list) {
    if (list.length < 1) return
    var cur = list.shift()
    fs.unlink(cur, function (err) {
        if (!err) {
            console.log(cur + '\t already unlink')
        } else {
            console.log('unlink fail', err)
        }
        if (list.length > 0) unlink(list)
    })
}

var app = require('app')

app.post('/publish/design-works/save-file', exports.saveFile)



//按比例缩放，只针对宽度
var resizeParam = [

];
//对上传的图片生成不同规格的缩略图
function resize(cur, fileId, cb) {
    var _resizeParam = resizeParam.filter(function (item) {
        return cur.width > item;
    });

    function _resize() {
        if (_resizeParam.length < 1) {
            cb();
            return;
        }
        var curSize = _resizeParam.shift();

        //生成缩略图并存入库中
        var dstSrc = cur.path + '_' + curSize;
        im.resize({
            srcPath: cur.path,
            dstPath: dstSrc,
            width: curSize
        }, function (err) {
            if (!err) {

                console.log(curSize + '规格缩略图生成完毕');
                tempFile.push(dstSrc);

                var gs = new GridStore(DB.dbServer, fileId + '_' + curSize, "w", {
                    "chunk_size": 10240
                });
                gs.writeFile(dstSrc, function (err) {
                    if (err) console.log(err);
                    _resize();
                });
            } else {
                console.log(err);
                _resize();
            }

        });
    }

    _resize();
}
