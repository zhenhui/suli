var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID
var helper = require('helper')
var xss = require('xss')

app.get('/admin/user', helper.csrf, function (req, res) {

    if (require('helper').isLogin(req) === false) {
        res.render('invalid-group', {title: '未登陆', err: [ '请先登陆']})
        return
    }

    helper.getGroup(req, function (group) {
        if (Array.isArray(group) === false) {
            res.render('invalid-group', {title: '无权限', err: [ '无法获取权限信息']})
            return
        }

        if (group.indexOf('管理员') >= 0) {
            var user = new db.Collection(db.Client, 'user')
            user.find({}, {_id: 1, user: 1, group: 1, ts: 1}).toArray(function (err, data) {
                res.render('admin/user/manager', {docs: data})
            })
        } else {
            res.render('invalid-group', {title: '非管理员组', err: [ '无权访问']})
        }
    })
})


//保存新用户
app.post('/admin/user/add-user', function (req, res) {

    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆')
        res.json(result)
        return
    }

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

    helper.getGroup(req, function (group) {
        if (Array.isArray(group) === false) {
            res.render('invalid-group', {title: '无权限', err: [ '无法获取权限信息']})
            return
        }
        if (group.indexOf('管理员') >= 0) {
            var user = new db.Collection(db.Client, 'user')
            user.insert(new_user, {safe: true}, function (err, docs) {
                if (!err && docs) {
                    info.success = true
                } else {
                    info.msg = '无法新建用户'
                    info.success = false
                }
                res.json(info)
            })
        } else {
            info.msg = '您没有权限'
            info.success = false
            res.json(info)
        }
    })
})

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


//更新密码
app.post('/admin/user/update/password', function (req, res) {

    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆或登陆失效')
        res.json(result)
        return
    }

    var re = /^[a-z\d]{128}$/

    if (re.test(req.body.p1) === false || re.test(req.body.p2) === false) {
        result.err.push('密码不符合验证规则')
        result.status = -3
        res.json(result)
        return
    }

    if (req.body.p1 === req.body.p2) {
        result.err.push('新密码必须和原密码不同哦')
        result.status = -4
        res.json(result)
        return
    }
    try {
        var id = ObjectID(req.session._id)
    } catch (e) {
        result.status = -5
        result.err.push('无法验证用户')
        res.json(result)
        return
    }

    var user = new db.Collection(db.Client, 'user')
    user.update({_id: id, pwd: req.body.p1}, {$set: {pwd: req.body.p2}}, {}, function (err, _result) {
        if (!err && _result > 0) {
            result.status = 1
        } else {
            result.status = -6
            result.err.push('请检查原密码是否正确')
        }
        res.json(result)
    })
})


//更新个人信息
var allowKey = ['address', 'job', 'qq', 'zone_url']

app.post('/admin/user/update/information', function (req, res) {
    var data = {
        privacy_information: {}
    }
    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆或登陆失效')
        res.json(result)
        return
    }

    try {
        var id = ObjectID(req.session._id)
    } catch (e) {
        result.status = -5
        result.err.push('无法验证用户')
        res.json(result)
        return
    }


    Object.keys(req.body).forEach(function (key) {
        if (allowKey.indexOf(key) > -1 && req.body[key].length > 0) {
            //code 10 表示全站公开,0 表示仅个人可见
            //目前默认为10
            data.privacy_information[key] = {
                code: 10,
                value: xss(req.body[key])
            }
        }
    })

    var user = new db.Collection(db.Client, 'user')
    user.update({_id: id}, {$set: data}, {}, function (err, _docs) {
        if (!err && _docs > 0) {
            result.status = 1
            result.msg = '成功更新了数据'
        } else {
            result.status = -1
            result.msg = '无法更新数据'
        }
        res.json(result)
    })
})

//获取自己的信息
app.get('/admin/user/get/personal-information', function (req, res) {
    var result = {err: []}
    try {
        var id = ObjectID(req.session._id)
    } catch (e) {
        result.status = -5
        result.err.push('无法验证用户')
        res.json(result)
        return
    }
    var user = new db.Collection(db.Client, 'user')
    user.findOne({_id: id}, {_id: 1, user: 1, group: 1, privacy_information: 1, ts: 1}, function (err, docs) {
        if (docs) {
            result.status = 1
            result.data = docs
            delete result.err
        } else {
            result.status = -4
            result.err.push('无法查询到当前用户的信息，您是否已经登陆？')
        }
        res.json(result)
    })
})

