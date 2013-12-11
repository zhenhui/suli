/**
 * Created by songsong on 12/9/13.
 */

var app = require('app')
var db = require('db')
var crypto = require('sha3')
var helper = require('helper')

app.get('/register', function (req, res) {
    res.render('register/index')
})

var emailRe = /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

var userNameRe = /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9]{2,}$/

app.post('/register', function (req, res) {

    var errResult = {err: []}


    var sessionCaptcha = req.session.captcha && req.session.captcha.toString()
    var captcha = req.body.captcha
    if (captcha && captcha.length !== 4 || captcha.toLowerCase() !== sessionCaptcha) {
        errResult.err.push({
            'captcha': 'captche fail'
        })
        errResult.status = -10
        res.json(errResult)
        return
    }

    delete req.session.captcha


    if (!userNameRe.test(req.body._) || req.body._.length > 8) {
        errResult.err.push({
            '_': 'user name fail'
        })
    }

    if (!emailRe.test(req.body.__)) {
        errResult.err.push({
            '_': 'email fail'
        })
    }

    if (!/^[a-z0-9]{128}$/.test(req.body.___)) {
        errResult.err.push({
            '_': 'pwd fail'
        })
    }

    if (req.body.readRule !== 'yes') {
        errResult.err.push({
            '_': 'unread rule'
        })
    }

    if (errResult.err.length > 0) {
        errResult.status = -1
        res.json(errResult)
        return
    }

    //Check Unique
    var user = new db.Collection(db.userClient, 'user')
    var registerList = new db.Collection(db.userClient, 'register-list')

    var userFindRe = new RegExp(req.body._, 'i')
    var emailFindRe = new RegExp(req.body.__, 'i')

    // step 1
    user.count({
        user: userFindRe
    }, {user: 1}, function (err, count) {

        if (!err && count > 0) {
            errResult.err.push({'_': 'user exist'})
        }

        // step 2
        user.count({
            email: emailFindRe
        }, function (err, count) {

            //check register logs

            if (!err && count > 0) {
                errResult.err.push({'__': 'email exist'})
            }

            if (errResult.err.length > 0) {
                errResult.status = -1
                res.json(errResult)
                return
            }

            // step 3 , check register-list
            registerList.count({user: userFindRe, count: 0}, function (err, count) {

                if (!err && count > 0) {
                    errResult.err.push({'_': 'user not yet completed the registration verification'})
                    errResult.stauts = -1
                    res.json(errResult)
                    return
                }

                // step 4
                registerList.count({email: emailFindRe, count: 0}, function (err, count) {

                    if (!err && count > 0) {
                        errResult.err.push({'__': 'email not yet completed the registration verification'})
                        errResult.stauts = -1
                        res.json(errResult)
                        return
                    }

                    sendEmail(req, res, user, registerList)

                })
            })
        })
    })
})


var nodemailer = require("nodemailer");

function sendEmail(req, res, user, registerList) {

    var id = crypto.sha3(req.body._ + req.body.__ + Math.random() + Date.now().toString(), {outputLength: 224 })

    var transport = nodemailer.createTransport("SMTP", {
        host: "smtp.163.com",
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: "sjplus@163.com",
            pass: "Hello1234"
        }
    });

    var url = 'http://' + req.headers.host + '/register/validator/' + id.toString()

    transport.sendMail({
        from: "sjplus@163.com",
        to: req.body.__,
        subject: "视界+需要验证您的邮箱",
        generateTextFromHTML: true,
        html: '<h3>' + req.body._ + '，请点击下方链接完成注册</h3>' +
            '<p>如果您的浏览器不支持链接，请复制到地址栏中进行访问</p>' +
            '<p><a href="' + url + '" target="_blank">' + url + '</a></p>'
    }, function (error, response) {
        if (error) {
            console.log('Send Fail :', error);
            res.json({status: -5, err: "Fail,Send Email fail"})

        } else {
            console.log("Message sent success: " + response.message);
            res.json({status: 1, msg: "Success"})


            //发送成功后才进行数据库的插入和添加
            var log = {
                id: id.toString(),
                user: req.body._,
                email: req.body.__,
                body: req.body,
                headers: req.headers,
                //Click count
                count: 0,
                ts: Date.now()
            }

            registerList.insert(log, {w: 1}, function (err) {
                if (err) {
                    res.json({status: -2, err: "Fail: on insert register-list"})
                    return
                }

                //insert user

                //Start insert user
                var newUser = {
                    "user": req.body._,
                    "pwd": req.body.___,
                    "email": req.body.__,
                    "group": [
                        "上传个人作品"
                    ],
                    "index": {
                        "design-works": 0,
                        "article": 0,
                        "follow": 0,
                        "follower": 0
                    },
                    //0 means that the freezing of accounts
                    "status": 0,
                    "ts": Date.now()
                }

                user.insert(newUser, {w: 1}, function (err) {
                    if (err) {
                        res.json({status: -4, err: "create user fail"})
                        registerList.remove({id: id.toString}, {w: 1}, function (err) {
                            console.log('remove register id:', id.toString(), err)
                        })
                        return
                    }
                    res.json({status: 1, msg: "success"})
                });
            });

        }
        transport.close();
    });

}


app.get(/\/register\/validator\/([a-z0-9]{56})/, function (req, res) {

    var result = {}

    if (helper.isLogin(req)) {
        result.status = -3
        res.render('register/validator', result)
        return
    }

    //Check Unique
    //var user = new db.Collection(db.userClient, 'user')
    var registerList = new db.Collection(db.userClient, 'register-list')

    registerList.findOne({id: req.params[0]}, function (err, docs) {

        if (!err && docs) {
            //2天内有效
            if (docs.ts + (48 * 3600 * 1000) > Date.now()) {
                result.status = 1
                result.user = docs.user
                result.email = docs.email

                //激活用户账户
                if (docs.count === 0) {
                    var user = new db.Collection(db.userClient, 'user')
                    user.update({email: docs.email}, {$set: {status: 1}}, {}, function (err, docs) {
                        if (err) console.log('Fail:激活账户是发生错误')
                        if (docs) {
                            console.log('成功激活账户')
                        } else {
                            console.log('Fail:无法激活账户')
                        }
                    })
                }

                //如果重复打开完成注册页面的URL，则+1
                registerList.update({id: req.params[0]}, {$inc: {count: 1}}, {}, function (err, docs) {

                })
            } else {
                result.status = -2
            }
        } else {
            result.status = -2
        }


        res.render('register/validator', result)

    })

})