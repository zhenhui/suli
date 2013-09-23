/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-20
 * Time: 上午11:13
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var template = require('template')

    var tpl = require('./comment.tpl')
    var cache = template.compile(tpl)

    //再render的时候便可以省去编译环节，提升渲染效率


    KISSY.use("waterfall,node,ajax", function (S, Waterfall, Node, IO) {
        var $ = Node.all
        var nextPage = 1

        exports.waterfall = new Waterfall.Loader({
            container: "#comment-container",
            // 窗口大小变化时的调整特效

            load: function (success, end) {
                // $('#loadingPins').show()
                IO({
                    data: {
                        id: $('#J-comment-container').attr('data-id'),
                        'page': nextPage,
                        'per_page': 3
                    },
                    url: '/design-works/comment/list',
                    dataType: "jsonp",
                    success: function (data) {
                        // 如果数据错误, 则立即结束
                        if (data['status'] !== 'ok') {
                            end()
                            return
                        }
                        // 拼装每页数据
                        var items = []
                        S.each(data.docs, function (item) {
                            items.push(new S.Node(template.render(cache, item)))
                        })
                        success(items)
                        // 如果到最后一页了, 也结束加载
                        nextPage = data.page + 1
                        if (nextPage > data.total_page) {
                            end()
                        }
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
    var $body = $(document.body)

    //发送留言
    $body.on('click', '.J-send-new-comment-trigger', function (ev) {
        var $this = $(this)
        var $parent = $this.parents('.J-new-comment')
        var $textarea = $parent.find('textarea')
        var val = $textarea.val()

        $.post("/design-works/comment/new", { content: val, _id: $textarea.attr('data-id') }, function (data) {
            if (data.docs) {
                $(template.render(cache, data.docs)).insertAfter($('#comment-container>div.ks-waterfall').eq(0))
                exports.waterfall.adjust()
            } else {
                if (data.status == -1) {
                    $('.J-login-triggers').trigger('click')
                }
            }
        })
    })

    var replyTpl = '<div class="J-reply-container reply-container">' +
        '<textarea></textarea>' +
        '<div class="control">' +
        '<button class="btn J-cancel">取消</button>' +
        '<button class="btn J-reply-send">发送</button>' +
        '</div>' +
        '</div>'

    //给留言留言
    $body.on('click', '.J-reply', function (ev) {
        var $this = $(this)
        ev.preventDefault()
        var $parent = $this.parents('.J-comment-item')
        exports.waterfall.adjustItem($parent, {
            effect: {
                easing: "easeNone",
                duration: 0.2
            },
            process: function () {
                if ($parent.find('.J-reply-container').size() > 0) {
                    $parent.find('.J-reply-container').remove()
                    $parent.find('.J-reply-trigger').show()
                } else {
                    $parent.find('.J-comment-area').append(replyTpl)
                    $parent.find('textarea').focus()
                    $parent.find('.J-reply-trigger').hide()
                }
            }
        })
    })

    //取消回复
    $body.on('click', '.J-cancel', function (ev) {
        ev.preventDefault()
        var $this = $(this)
        var $parent = $this.parents('.J-comment-item')
        exports.waterfall.adjustItem($parent, {
            effect: {
                easing: "easeNone",
                duration: 0.2
            },
            process: function () {
                $parent.find('.J-reply-trigger').show()
                $parent.find('.J-reply-container').remove()
            }
        })
    })

})
