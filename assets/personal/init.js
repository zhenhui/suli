/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午4:58
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var S = KISSY, DOM = S.DOM, Event = S.Event;

    require('/global/tab/init')

    var router = {
        'rencent-news': {

        },
        'love-': {

        },
        'all-works': {
            path: './all-works/init'
        },
        'love-works': {

        },
        'follow': {

        },
        'rights-management': {

        },
        'manage-share': {
            path: './design-works/init'
        },
        'account-setting': {
            path: './account/init'
        },
        'authenticate': {

        }
    }

    $trigger = $('#router-trigger')
    $trigger.on('click', 'a.link', function (ev) {
        var action = $(this).data('action')
        if (router[action]) {
            location.href = action
        }
        $trigger.find('a').not(this).removeClass('hover')
        $(this).addClass('hover')
    })

    var data = {}
    var hash = ''

    function checkHashChange() {
        var param = location.hash.lastIndexOf('{')
        if (param < 0) {
            hash = location.hash.substring(1)
        } else {
            hash = location.hash.substring(1, param)
            try {
                S.log('转换锚点后方的数据' + location.hash.substring(param))
                var _data = S.JSON.parse(location.hash.substring(param))
            } catch (e) {
                S.log('无法转义数据')
            }
        }

        if (_data !== undefined) data = _data

        if (router[hash] && router[hash].path) {
            require.async(router[hash].path, function (obj) {
                if (obj && obj.init) obj.init(data, hash)
                exports.highlight()
            })
        } else {
            var $container = $('#main-js-container')
            $container.html('未定义:' + hash)
        }
        $trigger.find('a').not(this).removeClass('hover')
        $trigger.find('a[href*="#' + hash + '"]').addClass('hover')
    }

    Event.on(window, 'hashchange', checkHashChange)

    Event.fire(window, 'hashchange', checkHashChange)

    //具体的行为
    $(document).on('click', '[data-behavior]', function (ev) {
        var $this = $(this)
        ev.preventDefault()
        //for ie 6
        var href = this.getAttribute('hash')
        var hash = $this.data('behavior')
        //other browser
        if (!href)  href = $this.attr('href')
        if (typeof href !== 'string') return
        var behaviorData = KISSY.unparam(href.substring(1))
        if (location.hash.indexOf('{') < 0) {
            location.hash = location.hash + S.JSON.stringify(behaviorData)
        } else {
            if (behaviorData['full_redirect'] === 'true') {
                delete behaviorData['full_redirect']
                location.hash = hash + S.JSON.stringify(behaviorData)
            } else {
                location.hash = hash + S.JSON.stringify(KISSY.mix(data, behaviorData))
            }
        }
    })

    //高亮当前路由所匹配的节点
    exports.highlight = function () {
        var allBehavior = $('[data-behavior="all-works"][data-behavior]')
        allBehavior.removeClass('behavior-active')
        for (var key in data) {
            allBehavior.filter('[href*="' + key + '=' + data[key] + '"]').addClass('behavior-active')
        }
    }
})