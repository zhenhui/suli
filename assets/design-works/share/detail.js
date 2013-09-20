/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-20
 * Time: 上午11:13
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    KISSY.use("waterfall,node,ajax", function (S, Waterfall, Node, IO) {
        var $ = Node.all;

        var tpl = require('./comment.tpl'),
            nextpage = 1,
            waterfall = new Waterfall.Loader({
                container: "#comment-container",
                // 窗口大小变化时的调整特效
                adjustEffect: {
                    duration: 0.5,
                    easing: "easeInStrong"
                },
                load: function (success, end) {
                   // $('#loadingPins').show();
                    IO({
                        data: {
                            'page': nextpage,
                            'per_page': 20,
                            'format': 'json'
                        },
                        url: '/temp',
                        dataType: "jsonp",
                        success: function (d) {
                            // 如果数据错误, 则立即结束
                            if (d['stat'] !== 'ok') {
                                alert('load data error!');
                                end();
                                return;
                            }
                            // 如果到最后一页了, 也结束加载
                            nextpage = d.page + 1;
                            if (nextpage > d.pages) {
                                end();
                                return;
                            }
                            // 拼装每页数据
                            var items = [];
                            S.each(d.data, function (item) {
                                items.push(new S.Node(S.substitute(tpl, item)));
                            });
                            success(items);
                        },
                        complete: function () {
                            //  $('#loadingPins').hide();
                        }
                    });
                },
                minColCount:2,
                colWidth: 390
            });


        $("#comment-container").delegate("click", ".del", function (event) {
            var w = $(event.currentTarget).parent(".ks-waterfall");
            waterfall.removeItem(w, {
                effect: {
                    easing: "easeInStrong",
                    duration: 0.1
                },
                callback: function () {
                    alert("删除完毕");
                }
            });
        });


        $("#comment-container").delegate("click", ".grow", function (event) {
            var w = $(event.currentTarget).parent(".ks-waterfall");
            waterfall.adjustItem(w, {
                effect: {
                    easing: "easeInStrong",
                    duration: 0.1
                },
                process: function () {
                    w.append("<p>i grow height by 100</p>");
                },
                callback: function () {
                    alert("调整完毕");
                }
            });
        });
    });
})