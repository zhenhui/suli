/**
 * Created by 松松 on 13-11-12.
 */
define(function (require, exports, module) {

    var tpl = require('./design-works.tpl')
    var template = require('template')

    var idMatch = location.href.match(/\/u\/([0-9a-z]{24})/g)
    var id = RegExp.$1

    exports.init = function () {
        if (idMatch) {
            $.ajax({
                url: "/user/design-works/json",
                data: {
                    _id: id
                },
                dataType: 'jsonp'
            }).done(function (data) {
                    console.log(data)
                    $('#main-container-wrapper').html(template.render(tpl, {data: data}))
                })
        }
    }
})