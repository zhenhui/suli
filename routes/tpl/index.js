/**
 * Created by 松松 on 13-10-31.
 */

var app = require('app')
var fs = require('fs')
var path = require('path')


//seajs-text插件，需要同源方可使用，此处是用来弥补这个缺陷
app.get(/\.tpl.js$/, function (req, res) {
    res.header('content-type', 'application/javascript; charset=utf-8')
    var filePath = path.join(global.assetsDir, req.path).replace(/\.js$/,'')
    fs.readFile(filePath, function (err, buffer) {
        if (!err) {
            var result = Object.create(null)
            result.tpl = buffer.toString()
            res.end('define(function(require,exports,module){ var result= ' + JSON.stringify(result) + ';return result.tpl  })')
        } else {
            res.end('define(function(require,exports,module){ return "' + req.path + ' not found"  })')
        }
    })
})
