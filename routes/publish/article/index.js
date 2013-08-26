var app = require('app')

app.get('/publish/article', function (req, res) {
    res.json({json: Date.now()})
});
