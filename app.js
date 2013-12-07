/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('db')

var app = express();

global.assetsDir = path.join(__dirname, 'assets')
exports.projectRootDir = __dirname

function start() {
// all environments
    app.set('port', process.env.PORT || 9000);
    app.set('view engine', 'jade');
    app.set('view cache', true);
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

    process.env.NODE_ENV = 'production';

    // development only
    if ('development' == process.env.NODE_ENV) {
        console.log("开发环境")
        app.use(express.errorHandler());
        global.assetsCDN = 'http://a.sj.cn'
        global.imgCDN = 'http://img.sj.cn'
        global.hostDOMAIN = 'http://www.sj.cn'
    }

    if ('production' == process.env.NODE_ENV) {
        console.log("生产环境")
        global.assetsCDN = 'http://a.sjplus.cn'
        global.imgCDN = 'http://img.sjplus.cn'
        global.hostDOMAIN = 'http://www.sjplus.cn'
    }

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
    exports.app = app

    app.use(function (req, res, next) {
        res.locals.req = req;
        next();
    });

    require('./routes')
}

db.open(start)


