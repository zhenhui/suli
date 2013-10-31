/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午4:58
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

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

        },
        'publish-pic': {
            path: './public-pic/init'
        }
    }

    KISSY.use('dom,event,json', function (S, DOM, Event) {
        //高亮当前路由所匹配的节点
        exports.highlight = function () {
            var allBehavior = $('[data-behavior]')
            var currentBehavior = allBehavior.filter('[data-behavior="' + hash + '"]')
            allBehavior.removeClass('behavior-active')
            for (var key in data) {
                currentBehavior.filter('[href*="' + key + '=' + data[key] + '"]').addClass('behavior-active')
            }
            currentBehavior.filter('.J-behavior').addClass('behavior-active')
        }

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
            exports.highlight()
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
            var param
            delete data['full_redirect']
            if (location.hash.indexOf('{') < 0) {
                delete behaviorData['full_redirect']
                param = S.JSON.stringify(behaviorData)
            } else {
                if (behaviorData['full_redirect'] === 'true') {
                    delete behaviorData['full_redirect']
                    param = S.JSON.stringify(behaviorData)
                } else {
                    delete behaviorData['full_redirect']
                    param = S.JSON.stringify(KISSY.mix(data, behaviorData))
                }
            }
            location.hash = hash + (param !== '{}' ? param : '')
        })
    })


})