/**
 * Created by 松松 on 13-12-4.
 */

var app = require('app')

app.get('/_csrf_token', function (req, res) {
    res.header('Cache-control', 'no-cache; must-revalidate')
    res.header('Expires', '-1');
    res.header('Last-Modified', ' Tue, 10 Jan 2000 02:19:00 GMT');
    res.header('Pragma', 'no-cache');
    res.header('content-type', 'application/javascript')

    if (req.query.callback) {
        res.send(req.query.callback + '("' + req.csrfToken() + '")')
    } else {
        res.send('window._csrf_token_="' + req.csrfToken() + '"')
    }
})