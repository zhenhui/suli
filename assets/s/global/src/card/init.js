/**
 * Created by songsong on 12/16/13.
 */

define(function (require, exports, module) {

    var template = require('template')
    var compileTpl = template.compile(require('./card.tpl'))

    require('./card.css')

    $('<div id="global-user-card"></div>').appendTo(document.body)

    var $cardNode = $('#global-user-card')

    var cl
    var popupCl

    var $window = $(window)

    $(document).on('mouseenter mouseleave', '.J-user-card', function (ev) {
        clearTimeout(cl)
        if (ev.type === 'mouseenter') {
            var $target = $(ev.currentTarget)
            var id = $target.data('user-id')
            cl = setTimeout(function () {
                getUserData(id, function (data) {
                    $cardNode.html(template.render(compileTpl, data[id])).fadeIn(100)
                    clearTimeout(popupCl)
                    var y = ev.pageY
                    if (ev.pageY + $cardNode.height() > $window.height() + $window.scrollTop()) {
                        y = $window.height() + $window.scrollTop() - $cardNode.height() - 10
                    }
                    var x = ev.pageX
                    if (ev.pageX + $cardNode.width() > $window.width() + $window.scrollLeft()) {
                        x = $window.width() + $window.scrollLeft() - $cardNode.width() - 10
                    }
                    //开始判断各种坐标
                    $cardNode.css({
                        left: x,
                        top: y
                    })
                })
            }, 300)
        } else {
            clearTimeout(cl)
            clearTimeout(popupCl)
            popupCl = setTimeout(function () {
                console.log('card hide')
                $cardNode.fadeOut(100)
            }, 1000)
        }
    })

    $cardNode.on('mouseenter mouseleave', function (ev) {

        if (ev.type === 'mouseenter') {
            clearTimeout(popupCl)
        } else {
            popupCl = setTimeout(function () {
                $cardNode.fadeOut(100)
            }, 400)
        }

    })

    function getUserData(id, cb) {
        $.ajax({
            url: '/u/json/user-info',
            data: {
                id_arr: id
            },
            dataType: 'jsonp'
        }).done(function (data) {
                if (data[id]) {
                    if (cb) cb(data)
                }
            })
    }
})




