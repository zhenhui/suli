/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-16
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    KISSY.use("overlay,event,dom", function (S, O, Event, DOM) {

        var tpl = require('./type.tpl')

        var dialog = new O.Dialog({
            elCls: 'publish-works',
            elStyle: {
                position: S.UA.ie == 6 ? "absolute" : "fixed",
                zIndex: 999
            },
            bodyContent: tpl,
            mask: true,
            align: {
                points: ['cc', 'cc']
            }
        });

        dialog.on('afterRenderUI', function () {
            if (dialog.get('isBindRenderUI__')) return
            dialog.set('isBindRenderUI__', true)
            S.one('a.ks-dialog-close').addClass('icon-untitled-16')
            Event.delegate(dialog.get('el'), 'click', '.ks-overlay-close', function (ev) {
                dialog.hide()
            })
        })

        function show() {
            dialog.show();
        }

        function center() {
            if (dialog.get("visible")) dialog.center();
        }

        Event.on(window, "scroll resize", center);

        var $body = $(document.body)

        $(window).on('keypress', function (ev) {
            var target = ev.target;
            if (ev.keyCode != 78 && ev.keyCode != 110) return
            if ((target.nodeName === 'INPUT' && /(text|password)/gmi.test(target.type)) || target.nodeName === 'TEXTAREA') return
            show()
        })


        $body.on('click', '.J-publish-work', function () {
            //好让那个折叠菜单隐藏掉
            $body.trigger('click')
            //显示出来
            show()
        })
        exports.show = function () {
            show()
        }
    });
})
