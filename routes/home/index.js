var app = require('app')
var template = require('template')
var cms = require('../cms/go')

app.get('/', function (req, res) {
    cms.readPage('home-2013', function (str) {
        res.header('content-type', 'text/html;charset=utf-8')
        res.end(template.render(str, {}))
    })
});
