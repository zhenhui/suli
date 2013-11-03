/**
 * Module dependencies.
 */

var express = require('express')
var http = require('http')
var path = require('path')
require('db')

var app = express()

global.assetsDir = path.join(__dirname, 'assets')

// all environments
app.set('port', process.env.PORT || 80)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.locals.basedir = './views'
app.use(express.favicon())

app.use(express.logger('dev'))
app.use(express.compress())
app.use(express.bodyParser({keepExtensions: false, uploadDir: __dirname + '/temp'}));

//req.body实体大小为110M（大多数文件为100M，多余的10M预留给req.body参数）
app.use(express.limit(110 * 1024 * 1000));

app.use(express.methodOverride())
app.use(express.cookieParser('your secret here'))
app.use(express.session())
app.use(app.router)
app.use(require('stylus').middleware(__dirname + '/assets'))
app.use(express.static(path.join(__dirname, 'assets')))

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler())
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
})

exports.app = app

require('./routes')
