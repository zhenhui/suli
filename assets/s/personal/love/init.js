/**
 * Created by 松松 on 13-10-12.
 */

define(function (require, exports, module) {
        var tab = require('./tab.tpl')

        require('./love.css')
        var $container = $('#main-js-container')
        exports.init = function (data, router) {
            //询问是否为当前路由
            if ($container.find('#love').length == 0) {
                $container.html(tab)
            }

            if (!data)return

            switch (data.view) {
                case  'design':
                    require('./design/init').init()
                    break;
                case  'article':
                    //require('./article/init').init()
                    break;
            }
        }
    }
)
