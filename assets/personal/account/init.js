/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午8:46
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var template = require('template')
    var tpl = require('./account.tpl')
    require('./account.css')
    var $container = $('#main-js-container')
    exports.init = function () {
        $container.html(tpl)
    }
})
