/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
require('db')

var app = express();

global.assetsDir = path.join(__dirname, 'assets')

// all environments
app.set('port', process.env.PORT || 80);
app.set('view engine', 'jade');
app.locals.basedir = './views'

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions: false, uploadDir: __dirname + '/temp'}));
app.use(express.cookieParser('Test'));
app.use(express.session());
app.use(express.csrf());
app.use(require('stylus').middleware(__dirname + '/assets'))
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.compress())

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

exports.app = app

require('./routes')
