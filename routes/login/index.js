/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-28
 * Time: 下午3:01
 * To change this template use File | Settings | File Templates.
 */
var app = require("app")
var db = require('db')


app.post('/login', function (req, res) {

    var user = new db.Collection(db.Client, 'user')

    var info = {}

    //用户名和密码应该是一个256位的效验和，前半是用户名，后半是密码

    if (!/[a-z\d]{256}/.test(req.body._)) {
        info.status = -1
        info.msg = '用户名和密码不正确'
        res.json(info)
        return
    }

    user.findOne({
        user: req.body._.substring(0, 128),
        pwd: req.body._.substring(128)
    }, {_id: 1, name: 1, ts: 1}, function (err, data) {
        if (err === null && data !== null) {
            info.status = 1
            info.msg = '登陆成功'
            info.data = data
        } else {
            info.status = -2
            info.msg = '用户名或密码不正确'
        }
        res.json(info)
    })


})
