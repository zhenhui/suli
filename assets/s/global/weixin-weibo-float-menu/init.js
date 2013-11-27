/**
 * Created by 松松 on 13-11-27.
 */

define(function (require, exports, module) {
    require('./menu.css')
    var tpl = require('./menu.tpl')
    var wrapper = document.createElement('div')
    wrapper.id = 'weixin-weibo-float-menu-wrapper'
    wrapper.innerHTML = tpl
    document.body.appendChild(wrapper)
})

