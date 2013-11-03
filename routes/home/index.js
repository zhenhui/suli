var app = require('app')
var cms = require('cms')
var template = require('template')

app.get('/', function (req, res) {
    cms.readPage('/home-2013', function (str) {
        res.header('content-type', 'text/html;charset=utf-8')
        res.end(str)
    })
});
