/**
 * Created by 松松 on 13-11-27.
 */

define(function (require, exports, module) {
    require('./menu.css')
    var tpl = require('./menu.tpl')
    var wrapper = document.createElement('div')
    wrapper.id = 'weixin-weibo-float-menu-wrapper'
    wrapper.innerHTML = tpl
    document.body.appendChild(wrapper)

    var $float = $('#weixin-weibo-float-menu-wrapper')

    $float.on('click', '.J-top', function () {
        $(document.body).animate({scrollTop: 0}, 300, 'swing', function () {
        });
    })
    $float.on('mouseenter mouseleave', '.J-weixin-trigger', function (ev) {
        if (ev.type === 'mouseenter') {
            $float.find('.weixin-tips').stop().fadeIn(100)
        } else {
            $float.find('.weixin-tips').stop().fadeOut(100)
        }
    })

    $float.on('click', '.J-weixin-trigger', function () {
        $float.find('.weixin-tips').stop().fadeToggle(100)
    })


})

