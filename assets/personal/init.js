/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午4:58
 * To change this template use File | Settings | File Templates.
 */

define(function (require, expoets, module) {

    var S = KISSY, DOM = S.DOM, Event = S.Event;

    var router = {
        'rencent-news': {

        },
        'love-': {

        },
        'all-works': {

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

    function checkHashChange() {
        var hash = location.hash.substring(1)
        if (router[hash] && router[hash].path) {
            require.async(router[hash].path, function (obj) {
                if (obj && obj.init) obj.init()
            })
        } else {
            var $container = $('#main-js-container')
            $container.html('未定义:' + hash)
        }
        $trigger.find('a').not(this).removeClass('hover')
        $trigger.find('a[href=#' + hash + ']').addClass('hover')
    }

    Event.on(window, 'hashchange', checkHashChange)

    Event.fire(window, 'hashchange', checkHashChange)

})