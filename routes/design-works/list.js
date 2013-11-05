/**
 * Created by 松松 on 13-11-5.
 */

var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID


//获取某个人最近的作品列表
// /design-works/list?users=arr1,arr2,...&count=10

app.get('/design-works/list', function (req, res) {

    var userArr = []
    var count = req.query.count

    if (req.query.user) {
        req.query.user.split(',').forEach(function (id) {
            try {
                userArr.push(ObjectID(id))
            } catch (e) {
                return false
            }
        })
    }

    console.log(userArr)


    //  console.log(req.query)

    var design = new db.mongodb.Collection(db.Client, 'design-works')
    var user = new db.mongodb.Collection(db.Client, 'user')

    user.find({_id: {$in: userArr}}, {_id: 1, user: 1}).toArray(function (err, docs) {
        console.log(docs)
    })

    res.end(req.query.user)
})