/**
 * Created by 松松 on 13-11-12.
 */
define(function (require, exports, module) {

    var tpl = require('./latest-design-works-tpl.tpl')
    var template = require('template')
    var page = 1
    var pageNum = 1
    var count = 36
    var sumPage = 0

    function getData() {
        $.ajax({
            url: hostDOMAIN + '/design-works/latest/list',
            dataType: 'jsonp',
            data: {
                page: page,
                pageNum: pageNum,
                count: count
            }
        }).done(function (data) {
                sumPage = data.sumPage
                if (page === data.sumPage) {
                    $('.J-show-more').html('没有更多了')
                }
                $(template.render(tpl, data)).appendTo($('#J-design-works-list'))
            })
    }

    getData()

    //显示更多
    $('.J-show-more').on('click', function (ev) {
        ev.preventDefault()
        if (page < sumPage) {
            page++
            getData()
        } else {
            $(this).html('没有更多了')
        }
    })


})