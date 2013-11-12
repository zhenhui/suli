/**
 * Created by 松松 on 13-11-12.
 */
define(function (require, exports, module) {

    console.log('加载用户视图')
    var tpl = require('./user-panel.tpl')
    var template = require('template')

    var idMatch = location.href.match(/\/u\/([0-9a-z]{24})/g)
    var id = RegExp.$1
    if (idMatch) {
        $.ajax({
            url: '/u/json/user-info',
            data: {
                id_arr: id
            },
            dataType: 'jsonp'
        }).done(function (data) {
                console.log(data)
                $('#user-panel').html(template.render(tpl, data[id]))
            })
    }
})