var app = require('app')

app.get('/', function (req, res) {
    res.render('home/index', {title: 'Hello suli!'})
});
