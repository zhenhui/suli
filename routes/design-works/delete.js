/**
 * Created by 松松 on 13-10-15.
 */

var helper = require('helper')
var DB = require('db')
var app = require('app')
var Grid = DB.mongodb.Grid

//删除作品
app.get('/design-works/delete', function (req, res) {

    var result = {err: []}

    try {
        var id = DB.mongodb.ObjectID(req.query.id)
    } catch (e) {
        result.err.push('不正确的参数')
        res.json(result)
        return
    }

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.jsonp(result)
        return
    }

    var design = new DB.mongodb.Collection(DB.Client, 'design-works')
    var grid = new Grid(DB.Client, 'fs');

    design.findOne({_id: id/*, owner_id: req.session._id*/}, {thumbnails_id: 1, file_id: 1, ps_id: 1}, function (err, data) {
        if (err) {
            result.err.push('查询出现错误')
            result.status = -2
            res.json(result)
            return
        }
        if (data === null) {
            result.err.push('无法找到该作品')
            result.status = -3
            res.json(result)
            return
        }

        //删除记录
        design.remove({_id: id}, {w: 1}, function (err, num) {
            if (err) {
                result.err.push('无法删除作品，删除过程中出现错误' + err)
                result.status = -4
                res.json(result)
                return
            }
            if (num === 1) {
                result.msg = '成功删除记录'
                result.status = 1
            } else {
                result.msg = '无法删除作品'
                result.status = -5
            }
            res.json(result)
        });

        //删除关联的所有文件
        Object.keys(data).forEach(function (key) {
            if (Array.isArray(data[key])) {
                data[key].forEach(function (file) {
                    deleteFS(file)
                })
            } else if (typeof data[key] === 'string') {
                deleteFS(data[key])
            }
        })
    })
    function deleteFS(file) {
        file = file.substring(0, file.indexOf(':'))
        grid.delete(file, function (err, result2) {
            if (err) {
                console.log('无法删除文件' + err)
            }
        })
    }
})