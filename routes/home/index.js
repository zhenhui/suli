var app = require('app')
var template = require('template')
var cms = require('../cms/go')
var helper = require('helper')

app.get('/', helper.csrf, function (req, res) {
    cms.readPage('home-2013', function (str) {
        res.render('home/index', {cmsTpl: template.render(str, {})})
    })
});
