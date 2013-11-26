/**
 * Created by 松松 on 13-11-26.
 */

define(function (require, exports, module) {

    var template = require('template')
    var login = require('s/global/login/login')

    var $wrapper = $('#J-comment-wrapper')
    //非常重要：留言所属的ID
    var id = $wrapper.attr('data-page-id')
    //非常重要：留言所属的类型，比如针对作品，还是针对文章的
    //目前仅仅支持两种类型
    var type = $wrapper.attr('data-type')
    var $h2
    var $window = $(window)
    var tpl = require('./comment-block.tpl')
    var cache = template.compile(tpl)

    $window.on('scroll', scrollCheck)

    function scrollCheck() {
        if ($window.scrollTop() + $window.height() > $wrapper.offset().top) {
            $window.off('scroll', scrollCheck)
            init()
        }
    }

    scrollCheck()

    function init() {
        require.async('./comment.css', function () {
            $h2 = $wrapper.find('h2')
            initWaterfall()
        })
        $('#J-comment-wrapper').html(require('./comment-textarea.tpl'))
    }

    function initWaterfall() {
        KISSY.use("gallery/waterfall/1.0/,node,ajax,dom,event", function (S, Waterfall, Node, IO) {

            var $ = Node.all
            var nextPage = 1
            var first = true

            exports.waterfall = new Waterfall.Loader({
                container: "#comment-container",
                // 窗口大小变化时的调整特效

                load: function (success, end) {
                    IO({
                        data: {
                            id: id,
                            'page': nextPage,
                            'per_page': 10
                        },
                        url: '/comment/list',
                        dataType: "jsonp",
                        success: function (data) {
                            if (first && data.total_count > 0) {
                                $h2.html(data.total_count > 0 ? ('<span class="J-count">' + data.total_count + '</span>条评论') : '暂无评论')
                                first = false
                            }
                            // 如果数据错误, 则立即结束
                            if (data['status'] !== 'ok') {
                                end()
                                if (first) {
                                    $h2.html('<span class="J-count">0</span>条评论')
                                    first = false
                                }
                                return
                            }

                            // 拼装每页数据
                            var items = []
                            S.each(data.docs, function (item) {
                                items.push(new S.Node(template.render(cache, item)))
                            })
                            // 如果到最后一页了, 也结束加载
                            nextPage = data.page + 1
                            if (nextPage > data.total_page) {
                                end()
                            }
                            success(items)
                        },
                        complete: function () {
                            //  $('#loadingPins').hide()
                        }
                    })
                },
                minColCount: 2,
                colWidth: 390
            })
        })
    }

    var $body = $(document.body)

    //发送留言
    $body.on('click', '.J-send-new-comment-trigger', function (ev) {
        var $this = $(this)
        var $parent = $this.parents('.J-new-comment')
        var $textarea = $parent.find('textarea')
        var val = $textarea.val()
        $.post("/comment/new", {
            content: val,
            _csrf: window._csrf_token_,
            _id: id,
            type: type
        }, function (data) {
            if (data.docs) {
                $(template.render(cache, data.docs)).insertAfter($('#comment-container>div.ks-waterfall').eq(0))
                exports.waterfall.adjust()
                var count = parseInt($h2.find('span.J-count').html(), 10)
                $h2.find('span.J-count').html(count + 1)
                $textarea.val('')
            } else {
                if (data.status == -1) {
                    login.login()
                } else {
                    alert('遇到错误：\r\n' + data.err.join('\r\n'))
                }
            }
        })
    })

    //回复的锚点
    $body.on('click', '.J-comment-trigger', function () {
        $('#J-comment-textarea').focus()
    })
})