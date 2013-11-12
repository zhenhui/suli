/**
 * Created by 松松 on 13-11-12.
 */
define(function (require, exports, module) {
    var template = require('template')
    var tpl = require('./article.tpl')

    var idMatch = location.href.match(/\/u\/([0-9a-z]{24})/g)
    var id = RegExp.$1

    exports.init = function () {
        if (idMatch) {
            $.ajax({
                url: "/user/article/json",
                data: {
                    _id: id
                },
                dataType: 'jsonp'
            }).done(function (data) {
                    $('#main-container-wrapper').html(template.render(tpl, {data: data}))
                })
        }
    }
})