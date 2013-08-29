/**
 * Module dependencies.
 */

var express = require('express')
var http = require('http')
var path = require('path')
require('db')

var app = express()

// all environments
app.set('port', process.env.PORT || 80)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.locals.basedir = './views'
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
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

var crypto = require("sha3")

exports.app = app

require('./routes')