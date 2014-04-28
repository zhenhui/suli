var helper = require('helper')
var DB = require('db')
var app = require('app')

//删除作品
app.get('/design-works/up-tv', function (req, res) {
    
    try {
        var id = ObjectID(req.query.id)
    } catch (e) {
        res.end('ID非法')
        return;
    }

    var result = {err: []}
    helper.getGroup(req, function (group) {

        if (Array.isArray(group) === false) {
            result.err.push('错误用户')
            res.jsonp(result)
            return
        }

        if (group.indexOf('前台电视作品控制') < 0) {
            result.err.push('没有权限')
            res.jsonp(result)
            return
        }


        

        var design = new DB.mongodb.Collection(DB.Client, 'design-works')

        //上电视
        design.update({_id: id}, {$set: {tv: req.query.tv === 'true' ? true : false }}, {}, function (err, num) {
            if (!err && num > 0) {
                result.status = 1
                delete result.err
            } else {
                result.status = -2
                result.err.push('无法上电视')
            }
            res.jsonp(result)

        })
    })

})

//删除作品
app.get('/design-works/up-tv/delete-all', function (req, res) {
     
    helper.getGroup(req, function (group) {

        if (Array.isArray(group) === false) {
            res.end()
            return
        }

        if (group.indexOf('前台电视作品控制') < 0) {
            res.end()
            return
        }

        var design = new DB.mongodb.Collection(DB.Client, 'design-works')
        design.update({ }, {$set: {tv: false }}, {}, function (err, num) {
            res.end()

        })
    })

})
