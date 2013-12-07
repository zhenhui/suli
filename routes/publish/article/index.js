var app = require('app')
var helper = require('helper')

app.get('/publish/article', function (req, res) {

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
        if (group.indexOf('发布文章') > -1) {
            res.render('publish/article/publish', {type: 'share'})
        } else {
            result.title = '您没有权限'
            result.err.push('您没有发表文章的权限')
            res.render('invalid-group', result)
        }
    })
})

app.post('/publish/article/save', require('./save').save)

//保存缩略图
app.post('/publish/article/save-article-banner', require('./article-banner').saveFile)
