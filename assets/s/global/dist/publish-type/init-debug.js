/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-16
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/global/0.0.1/publish-type/init-debug", [ "./type-debug.tpl" ], function(require, exports, module) {
    KISSY.use("overlay,event,dom", function(S, O, Event, DOM) {
        var tpl = require("./type-debug.tpl");
        var dialog = new O.Dialog({
            elCls: "publish-works",
            elStyle: {
                position: S.UA.ie == 6 ? "absolute" : "fixed",
                zIndex: 999
            },
            bodyContent: tpl,
            mask: true,
            align: {
                points: [ "cc", "cc" ]
            }
        });
        dialog.on("afterRenderUI", function() {
            if (dialog.get("isBindRenderUI__")) return;
            dialog.set("isBindRenderUI__", true);
            S.one("a.ks-dialog-close").addClass("icon-untitled-16");
            Event.delegate(dialog.get("el"), "click", ".ks-overlay-close", function(ev) {
                dialog.hide();
            });
        });
        function show() {
            dialog.show();
        }
        function center() {
            if (dialog.get("visible")) dialog.center();
        }
        Event.on(window, "scroll resize", center);
        var $body = $(document.body);
        $(window).on("keypress", function(ev) {
            var target = ev.target;
            if (ev.keyCode != 78 && ev.keyCode != 110) return;
            if (target.nodeName === "INPUT" && /(text|password)/gim.test(target.type) || target.nodeName === "TEXTAREA") return;
            show();
        });
        $body.on("click", ".J-publish-work", function() {
            //好让那个折叠菜单隐藏掉
            $body.trigger("click");
            //显示出来
            show();
        });
        exports.show = function() {
            show();
        };
    });
});

define("sjplus/global/0.0.1/publish-type/type-debug.tpl", [], '<div class="publish-control J-publish-control">\n    <p>\n        <a href="/publish/design-works" class="design-works">\n            <span class="bg">\n                <strong><b>new<br>design</b></strong>\n            </span>\n            <span class="title">发布新作品</span>\n        </a>\n        <a href="/publish/article" class="article">\n            <span class="bg">\n                <strong><b>new<br>point</b></strong>\n            </span>\n            <span class="title">发布文章</span>\n        </a>\n        <a class="front" href="javascript:alert(\'暂不可用\')">\n            <span class="bg">\n                <strong><b>new<br>code</b></strong>\n            </span>\n            <span class="title">前端演示代码</span>\n        </a>\n    </p>\n</div>');
