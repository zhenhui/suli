/**
 * Created by songsong on 12/9/13.
 */

var app = require('app')
var db = require('db')
var crypto = require('sha3')

app.get('/register', function (req, res) {

    res.render('register/index')

})

var emailRe = /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

var userNameRe = /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9]{2,}$/

app.post('/register', function (req, res) {

    var errResult = {err: []}

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
    if (!/^[a-z0-9]{4}$/i.test(req.body.captcha)) {
        errResult.err.push({
            '_': 'captche fail'
        })
    }
    if (req.body.readRule !== 'yes') {
        errResult.err.push({
            '_': 'unread rule'
        })
    }

    if (errResult.err.length > 0) {
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
                errResult.err.push({'_': 'email exist'})
            }

            if (errResult.err.length > 0) {
                res.json(errResult)
                return
            }

            // step 3 , check register-list
            registerList.count({user: userFindRe, count: 0}, function (err, count) {

                if (!err && count > 0) {
                    errResult.err.push({'_': 'user not yet completed the registration verification'})
                    errResult.stauts = -2
                    res.json(errResult)
                    return
                }

                // step 4
                registerList.count({email: emailFindRe, count: 0}, function (err, count) {

                    if (!err && count > 0) {
                        errResult.err.push({'_': 'email not yet completed the registration verification'})
                        errResult.stauts = -3
                        res.json(errResult)
                        return
                    }


                    //Create register url
                    var id = crypto.sha3(req.body._ + req.body.__ + Math.random() + Date.now().toString(), {outputLength: 224 })
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
                            res.json({status: -10, err: "Fail: on insert register-list"})
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
                                res.json({status: -10, err: "create user fail"})
                                return
                            }
                            sendEmail(req, res, id, registerList)
                        })


                    })
                })

            })

        })

    })

})


var nodemailer = require("nodemailer");

function sendEmail(req, res, id, registerList) {

    console.log('init SMTP Server')

    var transport = nodemailer.createTransport("SMTP", {
        host: "smtp.163.com",
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: "sjplus@163.com",
            pass: "Hello1234"
        }
    });

    console.log('Start send email')

    transport.sendMail({
        from: "sjplus@163.com",
        to: "xiongsongsong@beyondsoft.com",
        subject: "Please click url complete register",
        generateTextFromHTML: true,
        html: '<h1>' + req.body._ + '</h1>' +
            '<p>Thanks you register sjplus:Please click on the link below to complete registration.</p>' +
            '<p><a href="http://' + req.headers.host + '/register/validator/' + id.toString() + '">Complete registration!</a></p>'
    }, function (error, response) {
        if (error) {
            console.log('Send Fail :', error);
            res.json({status: -11, err: "Fail,Send Email fail"})
            registerList.remove({id: id.toString}, {w: 1}, function (err) {
                console.log('remove register id:', id.toString())
            })
        } else {
            console.log("Message sent success: " + response.message);

        }
        transport.close();
    });

}