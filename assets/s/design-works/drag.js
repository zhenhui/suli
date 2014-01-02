/**
 * Created by songsong on 12/17/13.
 */

$(function () {
    var $preview = $('#preview-img')
    $('.J-preview-image').on('click', function (ev) {
        if ($preview.find('img').length < 1) {
            $('<img src="' + ev.target.src + '?m=full-size" />').appendTo($preview)
        }
        show()
    })

    var $mask = $('#preview-img-mask')
    var $close = $('#preview-close')

    $close.on('click', hide)

    function show() {
        $document.on('keyup', checkClose)
        $mask.show()
        $preview.show()
        $close.show()
    }

    function hide() {
        $mask.hide()
        $preview.hide()
        $close.hide()
        $document.off('keyup', checkClose)
    }


    var pageX, pageY;
    var x, y
    var $document = $(document)
    var $window = $(window)

    function bindMouseDown(ev) {
        show()
        x = $preview.position().left
        y = $preview.position().top
        pageX = ev.pageX
        pageY = ev.pageY
        $document.on('mousemove', move)
        $document.on('mouseup', stop)
    }

    function checkClose(ev) {
        if (ev.keyCode === 27) {
            hide()
        }
    }

    function move(ev) {

        var left = x + (ev.pageX - pageX)
        var top = y + (ev.pageY - pageY)
        var viewWidth = $window.width()
        var viewHeight = $window.height()

        var margin = 200

        if (left > viewWidth - margin)  left = viewWidth - margin
        if (top > viewHeight - margin) {
            top = viewHeight - margin
        }

        if (top + $preview.height() < margin) {
            top = -$preview[0].offsetHeight + margin
        }
        if (left > viewWidth - margin) {
            left = viewWidth - margin
        }

        if (left + $preview.width() < margin) {
            left = -$preview[0].offsetWidth + margin
        }


        $preview.css({
            top: top,
            left: left
        })

    }

    function stop() {
        $document.off('mousemove', move)
        $document.off('mousemove', stop)
    }

    if ($preview[0].setCapture) {
        $document.on('mousedown', function (ev) {
            $preview[0].setCapture();
        })

        $document.on('mouseup', function (ev) {
            $preview[0].releaseCapture();
        })
    }


    $preview.on('mousedown', bindMouseDown)

    $preview.on('dragstart', function (ev) {
        ev.preventDefault()
    })


})
