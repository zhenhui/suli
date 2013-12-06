/**
 * Created by 松松 on 13-10-15.
 */

define(function (require, exports, module) {

    var template = require('template')

    var tpl = require('./article.tpl')
    require('./article.css')

    var $container

    exports.init = function () {
        console.log('当前处于文章视图中' + module.id)
        $container = $('#tab-container')
        $container.html('加载中...')
        $.getJSON('/personal/article/list?r' + Math.random(), function (data) {
            $container.html(template.render(tpl, data))
        })
    }
})