/**
 * Created by 松松 on 13-11-12.
 */

define(function (require, exports, module) {

    //加载用户面板
    require('./user-panel')

    KISSY.use('event', function (S, Event) {
        function hashChange() {
            $('#J-navigation-trigger a').removeClass('active')
            var hash = location.hash.substring(1)
            switch (location.hash) {
                case "#design-works":
                    require.async('./design-works', function (obj) {
                        obj.init()
                        $('#J-navigation-trigger a.' + hash).addClass('active')
                    })
                    break;
                case "#article":
                    require.async('./article', function (obj) {
                        obj.init()
                        $('#J-navigation-trigger a.' + hash).addClass('active')
                    })
                    break;
                default:
                    if (location.hash !== '#design-works' && location.hash !== '#article') {
                        require.async('./design-works', function (obj) {
                            obj.init()
                            $('#J-navigation-trigger a.design-works').addClass('active')
                        })
                    }
                    break;
            }
        }

        Event.on(window, 'hashchange', hashChange)
        hashChange()
    })
})
