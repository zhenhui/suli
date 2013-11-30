/**
 * Created by 松松 on 13-11-30.
 */
var app = require('app')
var db = require('db')
var helper = require('helper')

app.get('/admin/system', function (req, res) {

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
            var user = new db.Collection(db.userClient, 'user')
            user.find({}, {_id: 1, user: 1, group: 1, ts: 1}).toArray(function (err, data) {
                res.render('admin/system/index', {docs: data})
            })
        } else {
            res.render('invalid-group', {title: '非管理员组', err: [ '无权访问']})
        }
    })
})

//git pull
app.get('/admin/system/git-pull', function (req, res) {
    var exec = require('child_process').exec

    res.header('content-type', 'text/plain;charset=utf-8')

    exec('git pull', {cwd: app.projectRootDir, timeout: 10000},
        function (error, stdout, stderr) {
            if (stdout) {
                res.write(stdout)
            } else if (stderr) {
                res.write(stderr)
            } else {
                res.write('timeout ')
            }

            if (error !== null) {
                res.write(error.toString())
            }

            res.end()

        });
})


app.get('/admin/system/pm2-restart', function (req, res) {


    var exec = require('child_process').exec

    res.header('content-type', 'text/plain;charset=utf-8')

    var pm2id = req.query.pm2id

    if (!/^\d+$/.test(pm2id)) {
        res.end('require pm2 id')
        return
    }

    exec('pm2 restart ' + pm2id, {cwd: app.projectRootDir, timeout: 10000},
        function (error, stdout, stderr) {
            if (stdout) {
                res.write(stdout)
            } else if (stderr) {
                res.write(stderr)
            } else {
                res.write('timeout ')
            }

            if (error !== null) {
                res.write(error.toString())
            }

            res.end()

        });
})