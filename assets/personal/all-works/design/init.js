/**
 * Created by 松松 on 13-10-15.
 */

define(function (require, exports, module) {

    var tpl = require('./design.tpl')

    var template = require('template')

    var $container
    exports.init = function () {
        console.log('设计作品开始加载')
        $container = $('#tab-container')
        $container.innerHTML = '加载中'
        $.getJSON('/design-works/own/list', function (data) {
            $container.html(template.render(tpl, data))
        })
    }
})
