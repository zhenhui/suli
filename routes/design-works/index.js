/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */

var app = require('app')

app.get('/design-works/share/manage', function (req, res) {
    res.render('design-works/share/manage')
})

