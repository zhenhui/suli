/**
 * Created by 松松 on 13-11-7.
 */

define(function (require, exports, module) {

    var login = require('s/global/login/login')

    $(document.body).on('click', '.J-like', function (ev) {
        ev.preventDefault()
        var $target = $(ev.currentTarget)
        var type = $target.attr('data-type')
        if (!type) return
        if (location.href.indexOf('/design-works/detail')) {
            if ($target.hasClass('active')) {
                $.get('/index/unlike?type=' + type + '&r' + Math.random(), {
                        id: $target.data('id')
                    }
                ).done(function () {
                        $('.J-like').removeClass('active').find('.J-text').html('不爱了')
                    })
            } else {
                $.post('/index/add-like', {
                        id: $target.data('id'),
                        _csrf: window._csrf_token_,
                        type: type
                    }
                ).done(function (data) {
                        if (data.status === -1) {
                            login.login()
                        } else {
                            $('.J-like').addClass('active').find('.J-text').html('已喜欢')
                        }
                    })
            }
        }
    })

    //检测是否喜欢过

    $.get('/index/liked?id=' + window.designWorksId, function (boolean) {
        if (boolean) {
            $('.J-like').addClass('active').find('.J-text').html('已喜欢')
        }
    })

})