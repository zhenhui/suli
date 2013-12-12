/**
 * Created by 松松 on 13-11-29.
 */
define("sjplus/cms/stable/rollback/init-debug", [ "template-debug", "./rollback-source-debug.tpl" ], function(require, exports, module) {
    //todo:overlay无法隐藏是由于没有引入样式造成的，所以需要修改首页代码
    var template = require("template-debug");
    KISSY.use("overlay,event,dom", function(S, O, Event, DOM) {
        var tpl = require("./rollback-source-debug.tpl");
        var dialog = new O.Dialog({
            elCls: "J-rollback-source",
            elStyle: {
                position: S.UA.ie == 6 ? "absolute" : "fixed"
            },
            zIndex: 999,
            bodyContent: "",
            mask: true,
            align: {
                points: [ "cc", "cc" ]
            }
        });
        function show() {
            dialog.show();
            dialog.center();
        }
        function center() {
            if (dialog.get("visible")) dialog.center();
        }
        Event.on(window, "scroll resize", center);
        //查看历史
        $(document).on("click", ".J-rollback", function(ev) {
            $.ajax("/cms/rollback/history", {
                data: {
                    page_id: $(ev.currentTarget).data("id")
                },
                dataType: "jsonp"
            }).done(function(data) {
                dialog.set("bodyContent", template.render(tpl, {
                    docs: data
                }));
                show();
            });
        });
        //恢复版本
        $(document).on("click", ".J-rollback-version", function(ev) {
            if (!confirm("确认恢复此版本的代码？\r\n\r\n恢复后，需要重新发布页面，才会更新到线上。")) {
                return;
            }
            var $target = $(ev.currentTarget);
            $.ajax("/cms/rollback/version", {
                data: {
                    version_id: $(ev.currentTarget).data("version-id")
                },
                dataType: "jsonp"
            }).done(function(data) {
                if (data && data.length > 0) {
                    $target.addClass("btn-success").text("成功恢复");
                } else {
                    $target.addClass("btn-danger").text("恢复失败");
                }
            });
        });
    });
});

define("sjplus/cms/stable/rollback/rollback-source-debug.tpl", [], '<div style="padding: 12px 0">\n    <div style="height: 500px;overflow: auto;">\n        <table class="table table-condensed table-hover table-striped">\n            <tr>\n                <th width="45%">页面名称</th>\n                <th width="22%">日期</th>\n                <th width="15%">用户</th>\n                <th width="15%">操作</th>\n            </tr>\n            #each(item in docs)\n            #run var date=new Date(item.ts)\n            <tr>\n                <td>#{item.page_name}</td>\n                <td>\n                    <a href="/cms/tpl-source/version/#{item._id}" target="_blank" title="查看该版本代码">#{date.getFullYear()}-#{date.getMonth()+1}-#{date.getDate()} #{date.getHours()}:#{date.getMinutes()}:#{date.getSeconds()}</a>\n                </td>\n                <td>#{item.owner_name}</td>\n                <td><a class="btn btn-primary btn-xs J-rollback-version" data-version-id="#{item._id}">恢复</a></td>\n            </tr>\n            #end\n        </table>\n    </div>\n</div>');
