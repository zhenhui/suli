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
        'authenticate': {

        }
    }

    $('#router-trigger').on('click', 'a.link', function (ev) {
        var action = $(this).data('action')
        if (router[action]) {
            location.href = action
        }
    })

    function checkHashChange() {
        var hash = location.hash.substring(1)
        if (router[hash] && router[hash].path) require.async(router[hash].path)
    }

    Event.on(window, 'hashchange', checkHashChange)

    Event.fire(window, 'hashchange', checkHashChange)

})