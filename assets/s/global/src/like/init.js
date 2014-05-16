/**
 * Created by 松松 on 13-11-7.
 */

define(function (require, exports, module) {

    var login = require('sjplus/global/0.0.1/login/login')

    $(document.body).on('click', '.J-like', function (ev) {
        ev.preventDefault()
        var $target = $(ev.currentTarget)
        var type = $target.attr('data-type')
        var id = $target.data('id')
        if (!type) return
        if (location.href.indexOf('/design-works/detail')) {
            if ($target.hasClass('active')) {
                $.get('/index/unlike?type=' + type + '&r' + Math.random(), {
                        id: id
                    }
                ).done(function () {
                        $('.J-like').removeClass('active').find('.J-text').html('不爱了')
                        updateIndex(id, type)
                    })
            } else {
                $.post('/index/add-like', {
                        id: id,
                        _csrf: window._csrf_token_,
                        type: type
                    }
                ).done(function (data) {
                        if (data.status === -1) {
                            login.login()
                        } else {
                            $('.J-like').addClass('active').find('.J-text').html('已喜欢')
                            updateIndex(id, type)
                        }
                    })
            }
        }
    })

    function updateIndex(id, type) {
        $.ajax({
            url: '/index/find',
            data: {
                id: id,
                type: type
            },
            dataType: 'jsonp'
        }).done(function (data) {
                if (data) {
                    $('.J-like').find('.J-count').html(data.index.like)
                    $('.J-comment').find('.J-count').html(data.index.comment)
                }
            })
    }

})