/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var template = require('template')
    var tpl = require('./manage.tpl')
    require('./manage.css')
    var $container = $('#main-js-container')

    exports.init = function () {
        $.getJSON('/design-works/share/list', function (data) {
            $container.html(template.render(tpl, data))
        })
    }

})