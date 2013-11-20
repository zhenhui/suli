/**
 * Created by 松松 on 13-11-20.
 */

var DB = require('db')
var GridStore = DB.mongodb.GridStore

//一次性方法，删除用户表中头像之外的文件
var collection = new DB.mongodb.Collection(DB.userClient, 'fs.files')
collection.find({ 'metadata.type': {$ne: 'avatar'} }, {_id: 1, filename: 1, 'metadata.owner': 1}).toArray(function (err, docs) {
    if (!err) {
        deletePSD(docs)
    }
})

function deletePSD(docs) {
    if (docs.length < 1)  return
    var curDocs = docs.shift()
    GridStore.unlink(DB.userServer, curDocs._id, function (err) {
        if (!err) {
            console.log('成功删除user中的非头像文件' + curDocs._id)
        } else {
            console.log('无法删除user中的非头像文件' + curDocs._id, err)
        }
        deletePSD(docs)
    })
}

//删除视界Plus中头像文件
//一次性方法，删除用户表中头像之外的文件
var avatar = new DB.mongodb.Collection(DB.Client, 'fs.files')
avatar.find({ 'metadata.type': 'avatar'}, {_id: 1, filename: 1, 'metadata.owner': 1}).toArray(function (err, docs) {
    if (!err) {
        deleteSjplus(docs)
    }
})

function deleteSjplus(docs) {
    if (docs.length < 1)  return
    var curDocs = docs.shift()
    GridStore.unlink(DB.dbServer, curDocs._id, function (err) {
        if (!err) {
            console.log('成功删除sjplus中' + curDocs._id)
        } else {
            console.log('失败删除sjplus中' + curDocs._id, err)
        }
        deleteSjplus(docs)
    })
}
