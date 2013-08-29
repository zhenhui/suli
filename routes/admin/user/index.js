var app = require('app')
var db = require('db');

app.get('/admin/user', function (req, res) {

    var user = new db.Collection(db.Client, 'user')

    user.find({}, {_id: 1, name: 1, group: 1, ts: 1}).toArray(function (err, data) {
        console.log(data)
        res.render('admin/user/manager', {docs: data})

    })

})


//保存新用户
app.post('/admin/user/add-user', function (req, res) {

    var user = new db.Collection(db.Client, 'user')

    var body = req.body

    var info = {}

    if (/^[a-z\d]{256}$/.test(req.body._) === false) {
        info.msg = '用户名或密码参数非法'
        info.success = false
        res.json(info)
        return
    }

    var new_user = {
        name: req.body.name,
        user: req.body._.substring(0, 128),
        pwd: req.body._.substring(128),
        ts: Date.now()
    }

    if (body.group) new_user.group = body.group.trim().split(/\s+/)

    user.insert(new_user, {safe: true}, function (err, docs) {
        if (!err && docs) {
            info.success = true
            res.json(info)
        } else {
            info.msg = '无法新建用户'
            info.success = false
            res.json(info)
        }
    })

})
