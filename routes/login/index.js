/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-28
 * Time: 下午3:01
 * To change this template use File | Settings | File Templates.
 */

var app = require("app")
var db = require('db')
var helper = require('helper')


app.post('/login', function (req, res) {

    var user = new db.Collection(db.userClient, 'user')

    var result = {}

    user.findOne({
        user: req.body._,
        pwd: req.body.__
    }, {_id: 1, user: 1, ts: 1}, function (err, data) {
        if (err === null && data !== null) {
            result._id = data._id
            result.status = 1
            result.msg = '登陆成功'
            result.user = data.user;
            result._csrf_token_ = req.csrfToken()

            req.session.login_ts = Date.now()
            req.session.user = data.user
            req.session._id = data._id
            console.log(data.user + '登陆成功')

            //if pwd not modify
            if (req.body.__ === '8ca32d950873fd2b5b34a7d79c4a294b2fd805abe3261beb04fab61a3b4b75609afd6478aa8d34e03f262d68bb09a2ba9d655e228c96723b2854838a6e613b9d') {
                //10 is the highest and information with very danger
                helper.addUserSessionNotice(req, 'require_modify_pwd', 10)
            }

        } else {
            result.status = -2
            result.msg = '用户名或密码不正确'
            console.log(req.body._ + '登陆失败')
        }
        result._csrf_token_ = req.csrfToken()
        res.json(result)


        //保存用户登陆日志
        delete result._csrf_token_
        var log = {body: req.body, headers: req.headers, result: result, ts: Date.now()}
        var logCollection = new db.Collection(db.userClient, 'login-log')
        console.log('开始保存登陆日志：', Date.now())
        logCollection.insert(log, {w: 1}, function (err) {
            if (err) {
                console.log('失败：无法保存登陆日志', log)
            }
        })

    })

})

//判断当前是否为登陆状态
app.get('/login/is-login', function (req, res) {
    var info = {}

    if (req.session._id) {
        info._id = req.session._id
        info.status = 1
        info.msg = '已登陆'
        info.user = req.session.user
        info.status = 1
        console.log(info.user + '检测登陆成功')
    } else {
        info.status = -3
        info.msg = '当前未登陆'
    }

    info._csrf_token_ = req.csrfToken()

    info.sessionNotify = req.session.userSessionNotice

    res.jsonp(info)

})


//退出登陆
app.get('/login/login-out', function (req, res) {
    console.log(req.session.user + '退出登陆')
    req.session.destroy();
    res.redirect('/');
})


//获取个人基本信息