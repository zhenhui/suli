/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 上午11:17
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var helper = require('helper')

//上传作品的界面
app.get('/publish/design-works', function (req, res) {

    var result = {err: []}
    if (require('helper').isLogin(req) === false) {
        result.title = '您没有登陆'
        result.err.push('未登陆')
        //-10代表未登陆
        result.status = -10
        res.render('invalid-group', result)
        return
    }

    helper.getGroup(req, function (group) {
        if (Array.isArray(group) === false) {
            result.title = '无法获取权限信息，请联系网站管理员'
            result.err.push('无法获取权限信息')
            res.render('invalid-group', result)
            return
        }
        if (group.indexOf('上传共享作品') > -1) {
            res.render('publish/design-works/publish', {type: 'share'})
        } else if (group.indexOf('上传个人作品') > -1) {
            res.render('publish/design-works/publish', {type: 'own'})
        } else {
            result.title = '您没有权限'
            result.err.push('您没有上传作品的权限')
            res.render('invalid-group', result)
        }
    })
})

require('./save-file')

//保存主图
app.post('/publish/design-works/save-main-file', require('./save-file').saveFile)

//保存缩略图
app.post('/publish/design-works/save-thumbnails', require('./save-thumbnails').saveFile)

//保存附件
//app.post('/publish/design-works/save-ps', require('./save-ps').saveFile)

//删除文件
app.get('/publish/design-works/delete', require('./delete').delete)

//保存共享的作品
app.post('/publish/design-works/save', require('./save').save)
