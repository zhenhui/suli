/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-16
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    $(window).on('keypress', function (ev) {
        var target = ev.target;
        if (ev.keyCode != 78 && ev.keyCode != 110) return
        if (target.nodeName === 'INPUT' && /(text|password)/gmi.test(target.type)) return
        exports.show()
    })

    var Dialog = require('dialog')
    var tpl = require('./type.tpl')

    var dialog = new Dialog({
        content: tpl,
        width: 884,
        height: 306
    })


    exports.show = function () {
        dialog.render()
        dialog.show()
	}

})
