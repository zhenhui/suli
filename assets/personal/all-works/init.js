/**
 * Created by 松松 on 13-10-12.
 */

define(function (require, exports, module) {
        var tab = require('./tab.tpl')
        require('./all-works.css')
        var $container = $('#main-js-container')
        exports.init = function (data, router) {
            //询问是否为当前路由
            if ($container.find('#all-works').length == 0) {
                $container.html(tab)
            }

            if (!data)return

            switch (data.view) {
                case  'design':
                    console.log('进入设计视图')
                    require('./design/init').init()
                    break;
                case  'article':
                    console.log('进入文章视图')
                    require('./article/init').init()
                    break;
            }
        }
    }
)