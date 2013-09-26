/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-26
 * Time: 下午2:31
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var helper = require('helper')

app.get('/personal', function (req, res) {
    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.title = '您没有登陆'
        result.err.push('未登陆')
        //-10代表未登陆
        result.status = -10
        res.render('invalid-group', result)
        return
    } else {
        res.render('personal/index', {user_id: req.session._id, user_name: req.session.user})
    }
})