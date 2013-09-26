var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID

app.get('/admin/user', function (req, res) {

    var user = new db.Collection(db.Client, 'user')

    user.find({}, {_id: 1, user: 1, group: 1, ts: 1}).toArray(function (err, data) {
        console.log(data)
        res.render('admin/user/manager', {docs: data})

    })

})


//保存新用户
app.post('/admin/user/add-user', function (req, res) {


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

    var user = new db.Collection(db.Client, 'user')
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

var helper = require('helper')

//更新用户组的权限
app.post('/admin/user/update/group', function (req, res) {

    //只有管理员组成员能修改权限

    var result = {err: []}
    try {
        var id = ObjectID(req.body.id)
        var newGroup = req.body.group.split(/\s+/)
    } catch (e) {
        result.status = -1
        result.err.push('参数非法')
        res.json(result)
        return
    }

    //过滤掉重复的权限
    var _g = []
    newGroup.forEach(function (item) {
        if (_g.indexOf(item) < 0)   _g.push(item)
    })

    helper.getGroup(req, function (group) {
        if (Array.isArray(group) === false) {
            result.status = -2
            result.err.push('无法获取权限信息')
            res.json(result)
            return
        }
        if (group.indexOf('管理员') >= 0) {
            var user = new db.Collection(db.Client, 'user')
            user.update({_id: id}, {$set: {group: newGroup}}, {}, function (err, result) {
                if (!err && result > 0) {
                    result.status = 1
                } else {
                    result.status = -3
                    result.err.push('更新过程中发生错误')
                }
                res.json(result)
            })
        } else {
            result.status = -10
            result.err.push('您没有权限')
            res.json(result)
        }
    })
})