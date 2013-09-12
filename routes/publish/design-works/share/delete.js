/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-12
 * Time: 下午3:45
 * To change this template use File | Settings | File Templates.
 */

var DB = require('db')
var GridStore = DB.mongodb.GridStore
var ObjectID = DB.mongodb.ObjectID


exports.delete = function (req, res) {

    if (require('helper').isLogin(req) === false) {
        res.json({err: '未登陆'})
        return
    }

    var id = req.query.id

    var re = /([a-z0-9]+)/

    if (typeof id === 'string') {
        id = req.query.id.match(re)
    }

    if (id[0]) id = new RegExp(id[0])

    //先找出所有的文件
    var collection = new DB.mongodb.Collection(DB.Client, 'fs.files')
    collection.find({ filename: id }, {_id: 1, fileName: 1, filename: 1}).toArray(function (err, docs) {
        if (!err) {
            res.json({docs: docs})
            deletePSD(docs)
        } else {
            res.json({err: '未找到要删除的文件'})
        }
    })
}

function deletePSD(docs) {
    if (docs.length < 1)  return
    var curDocs = docs.shift()
    GridStore.unlink(DB.dbServer, curDocs._id, function (err) {
        if (!err) {
            console.log('成功删除' + curDocs._id)
        } else {
            console.log('无法删除' + curDocs._id, err)
        }
        deletePSD(docs)
    })
}
