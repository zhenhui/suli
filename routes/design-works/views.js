/**
 * Created by 松松 on 13-11-8.
 */


var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID
var helper = require('helper')

//浏览量
//利用_csrf_token来防止恶意刷新流量
//尽管如此，用户也可以通过删除Cookie来增加浏览量
//所以并不是完美的就解决办法

app.post('/design-works/index/add-view', helper.csrf, function (req, res) {

    res.end()

    try {
        var id = ObjectID(req.body.id)
    } catch (e) {
        res.end()
        return;
    }

    var view = new db.mongodb.Collection(db.Client, 'design-works-index-view')

    var data = {
        work_id: id.toString(),
        token: req.session._csrf,
        owner_user: req.session.user,
        owner_id: req.session._id,
        ts: Date.now()
    }

    //如果是未登录用户，则不可能产生下方记录，故删除
    if (!data.owner_user) delete data.owner_user
    if (!data.owner_id) delete data.owner_id

    //对于登陆用户，在时间阈值内不累加浏览量
    //对于未登陆用户，也进行此判断
    //但无法防止重复清除cookie导致的“恶意”请求
    view.findAndModify({
        work_id: id.toString(),
        token: req.session._csrf,
        ts: {
            //同一用户(包括未登陆和含csrf_token)在同一个作品中，2小时候之后才算增加一次浏览量
            $gte: Date.now() - (3600 * 1000 * 2)
        }
    }, [
        ['ts', -1]
    ], data, {
        w: 1,
        upsert: true
    }, function (err, docs) {
        console.log(err, docs)
    })
})
