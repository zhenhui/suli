/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-13
 * Time: 下午3:32
 * To change this template use File | Settings | File Templates.
 */
var app = require('app')
var DB = require('db')

app.get(/\/read\/(.+)/i, function (req, res) {

    var id = req.params && req.params[0]

    var gs = new DB.mongodb.GridStore(DB.dbServer, req.params[0], "r");
    res.header('Cache-Control', 'max-age=315360000');
    res.header('Expires', ' Tue, 10 Jan 2023 02:19:00 GMT');
    res.header('Last-Modified', ' Tue, 10 Jan 2000 02:19:00 GMT');
    gs.open(function (err, gs) {
        if (!err) {
            gs.read(gs.length, function (err, data) {
                res.end(data);
            });
        } else {
            res.end('read error');
        }

    });

})