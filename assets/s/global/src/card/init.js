/**
 * Created by songsong on 12/16/13.
 */

define(function (require, exports, module) {

    var S = KISSY

    var position = require('position')
    var template = require('template')
    var compileTpl = template.compile(require('./card.tpl'))

    require('./card.css')

    $('<div id="global-user-card"></div>').appendTo(document.body)

    var $cardNode = $('#global-user-card')

    var cl

    $(document).on('mouseenter mouseleave', '.J-user-card', function (ev) {
        clearTimeout(cl)
        if (ev.type === 'mouseenter') {
            var $target = $(ev.currentTarget)
            cl = setTimeout(function () {
                init($target, $target.data('user-id'))
            }, 300)
        } else {
            clearTimeout(cl)
        }
    })

    var $window = $(window)

    function init(target, id) {
        getUserData(id, function (data) {

            $cardNode.html(template.render(compileTpl, data[id]))

            //开始判断各种坐标
            var offset = target.offset();

            //判断是应该在左边和右边显示
            var x
            if (offset.left - $window.scrollLeft() - $cardNode.width() / 2 < 0) {
                x = target.width() / 2
                console.log('超出左边界')
            } else {
                //检测是否超出了右边界
                if (offset.left + $cardNode.width() > $window.width() + $window.scrollLeft()) {
                    console.log('超出右边界')
                    x = '100%'
                } else {
                    console.log('剧中显示')
                    x = '50%'
                }
            }


            //优先在上方显示
            if (offset.top - $cardNode.height() > $window.scrollTop()) {
                position.pin({
                    element: $cardNode,
                    x: x,
                    y: '100%'
                }, {
                    element: target,
                    x: target.width() / 2,
                    y: '0'
                })
            } else {
                position.pin({
                    element: $cardNode,
                    x: x,
                    y: '0'
                }, {
                    element: target,
                    x: target.width() / 2,
                    y: '100%'
                })
            }


        })
    }

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




