/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-16
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $body = $(document.body)

    $(window).on('keypress', function (ev) {
        var target = ev.target;
        if (ev.keyCode != 78 && ev.keyCode != 110) return
        if (target.nodeName === 'INPUT' && /(text|password)/gmi.test(target.type)) return
        exports.show()
    })

    var Dialog = require('dialog')
    var tpl = require('./type.tpl')

    var dialog = new Dialog({
        trigger: '.J-publish-work',
        content: tpl,
        width: 884,
        height: 306
    })

    $body.on('click', '.J-publish-work', function () {
        //好让那个折叠菜单隐藏掉
        $body.trigger('click')
        //显示出来
        dialog.show()
    })


    exports.show = function () {
        dialog.show()
    }

})
