var app = require('app')
var db = require('db')

app.get('/admin/user', function (req, res) {

    var user = new db.Collection(db.Client, 'user')

    user.find({}, {_id: 1, user: 1, group: 1, ts: 1}).toArray(function (err, data) {
        console.log(data)
        res.render('admin/user/manager', {docs: data})

    })

})


//保存新用户
app.post('/admin/user/add-user', function (req, res) {

    var user = new db.Collection(db.Client, 'user')

    var body = req.body

    var info = {}

    var user_name = (typeof req.body._ === 'string' ? req.body._ : '').trim()
    var pwd = (typeof req.body.__ === 'string' ? req.body.__ : '').trim()

    if (user_name.length < 2 || user_name.length > 50) {
        info.msg = '用户名长度不符合要求'
        info.success = false
        res.json(info)
        return
    }

    if (/^[a-z\d]{128}$/.test(pwd) === false) {
        info.msg = '密码非法'
        info.success = false
        res.json(info)
        return
    }

    var new_user = {
        user: user_name,
        pwd: pwd,
        status: 1,
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
