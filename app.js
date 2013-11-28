/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('db')

var app = express();

global.assetsDir = path.join(__dirname, 'assets')

function start() {
// all environments
    app.set('port', process.env.PORT || 80);
    app.set('view engine', 'jade');
    app.locals.basedir = './views'
    app.use(express.compress())
    app.use(express.logger('dev'));
    app.use(express.urlencoded());
    //req.body实体大小为210M（大多数文件为200M内，多余的10M预留给req.body参数）
    app.use(express.limit(210 * 1024 * 1000));
    app.use(express.bodyParser({keepExtensions: false, uploadDir: __dirname + '/temp'}));
    app.use(express.methodOverride());
    app.use(express.cookieParser('sjplus'));

    //session store
    var MongoSessionStore = require('connect-mongo')(express);
    app.use(express.session({
        secret: 'sjplus',
        store: new MongoSessionStore({
            db: 'session'
        })
    }));
    app.use(express.csrf());
    app.use(require('stylus').middleware(__dirname + '/assets'))
    app.use(express.static(path.join(__dirname, 'assets')))

    // development only
    if ('development' == app.get('env')) {
        console.log("开发环境")
        app.use(express.errorHandler());
        global.assetsCDN = global.imgCDN = global.hostDOMAIN = ''
    }

    if ('production' == app.get('env')) {
        console.log("生产环境")
        global.assetsCDN = ''
        global.imgCDN = ''
        global.hostDOMAIN = ''
    }

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
    exports.app = app
    require('./routes')
}

db.open(start)


