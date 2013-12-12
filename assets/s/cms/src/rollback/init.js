/**
 * Created by 松松 on 13-11-29.
 */

define(function (require, exports, module) {

    //todo:overlay无法隐藏是由于没有引入样式造成的，所以需要修改首页代码

    var template = require('template')

    KISSY.use("overlay,event,dom", function (S, O, Event, DOM) {

        var tpl = require('./rollback-source.tpl')

        var dialog = new O.Dialog({
            elCls: 'J-rollback-source',
            elStyle: {
                position: S.UA.ie == 6 ? "absolute" : "fixed"
            },
            zIndex: 999,
            bodyContent: '',
            mask: true,
            align: {
                points: ['cc', 'cc']
            }
        });

        function show() {
            dialog.show();
            dialog.center()
        }


        function center() {
            if (dialog.get("visible")) dialog.center();
        }

        Event.on(window, "scroll resize", center);

        //查看历史
        $(document).on('click', '.J-rollback', function (ev) {
            $.ajax('/cms/rollback/history', {
                data: {
                    page_id: $(ev.currentTarget).data('id')
                },
                dataType: 'jsonp'
            }).done(function (data) {
                    dialog.set('bodyContent', template.render(tpl, {docs: data}))
                    show()
                }
            )
        })

        //恢复版本
        $(document).on('click', '.J-rollback-version', function (ev) {

            if (!confirm('确认恢复此版本的代码？\r\n\r\n恢复后，需要重新发布页面，才会更新到线上。')) {
                return
            }

            var $target = $(ev.currentTarget)

            $.ajax('/cms/rollback/version', {
                data: {
                    version_id: $(ev.currentTarget).data('version-id')
                },
                dataType: 'jsonp'
            }).done(function (data) {
                    if (data && data.length > 0) {
                        $target.addClass('btn-success').text('成功恢复')
                    } else {
                        $target.addClass('btn-danger').text('恢复失败')
                    }
                }
            )
        })
    });
})