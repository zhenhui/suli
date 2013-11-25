/**
 * Created by 松松 on 13-11-25.
 */

var app = require('app')
var crypto = require('crypto')

app.get('/weixin/echo-token', function (req, res) {

    var $token = 'sjplus-2013011025'

    var arr = [  $token, req.query.timestamp  , req.query.nonce ].sort()

    var shasum = crypto.createHash('sha1');
    shasum.update(arr.join(''))

    if (shasum.digest('hex') === req.query.signature) {
        res.end(req.query.echostr);
    } else {
        res.end(req.query.signature);
    }

})