/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')
var DB = require('db')

/*作品共享页面*/
app.get('/design-works/share/manage', function (req, res) {
    var share = new DB.mongodb.Collection(DB.Client, 'design-works-public-share')
    share.find({owner: req.session._id}, {}).toArray(function (err, docs) {
        res.render('design-works/share/manage', {docs: docs})
    })
})


