/**
 * Created by songsong on 12/9/13.
 */

var app = require('app')
var db = require('db')

app.get('/register', function (req, res) {

    res.render('register/index')

})

app.post('/register', function (req, res) {

    res.json(req.body)

})