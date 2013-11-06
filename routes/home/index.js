var app = require('app')
var template = require('template')
var cms = require('../cms/go')

app.get('/', function (req, res) {
    cms.readPage('home-2013', function (str) {
        res.render('home/index', {cmsTpl: template.render(str, {})})
    })
});
