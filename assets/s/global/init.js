/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 下午9:18
 * To change this template use File | Settings | File Templates.
 */


define(function (require, exports, module) {
    KISSY.ready(function () {
        require('./login/login')
        require('./publish-type/init')
        require('./weixin-weibo-float-menu/init')

        var href = location.href

        $('<div id="feedback"><h4>反馈</h4><a href="mailto:hangzhenhui@beyondsoft.com?subject='+encodeURIComponent('页面交互、功能性建议')+'&amp;cc=xiongsongsong@beyondsoft.com&amp;body=url:' + href + '">1：页面、优化、功能性建议</a>' +
            '<a href="mailto:xiongsongsong@beyondsoft.com?subject='+encodeURIComponent('页面报错，点击不正常，无法使用')+'&amp;cc=hangzhenhui@beyondsoft.com&amp;body=url:' + href + '">2：页面报错，点击不正常，无法使用</a></div>')
            .appendTo($('#footer-container'))

    })
})

