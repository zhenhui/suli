var helper = require('helper')
var DB = require('db')
var app = require('app')

//删除作品
app.get('/design-works/up-tv', function (req, res) {

    helper.getGroup(req, function (group) {

        if (Array.isArray(group) === false) {
            res.end('')
            return
        }

        if (group.indexOf('前台电视作品控制') < 0) {
            res.end('')
            return
        }


        var result = {err: []}

        var design = new DB.mongodb.Collection(DB.Client, 'design-works')

        //上电视
        design.update({_id: id, owner_id: req.session._id}, {$set: {tv: req.query.tv === 'true' ? true : false }}, {}, function (err, num) {
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
