/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 上午11:17
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')

app.get('/publish/design-works', function (req, res) {

    res.render('publish/design-works/publish')

})

require('./save-file')

//保存主图
app.post('/publish/design-works/save-main-file', require('./save-file').saveFile)

//保存缩略图
app.post('/publish/design-works/save-thumbnails', require('./save-thumbnails').saveFile)

//保存附件
app.post('/publish/design-works/save-ps', require('./save-ps').saveFile)
