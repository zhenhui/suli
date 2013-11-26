/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-20
 * Time: 上午11:13
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    //加载喜欢组件
    require('s/global/like/init')

    require('s/global/comment/comment')

    //控制浏览量
    $.post('/index/add-view', {
            id: window.designWorksId,
            _csrf: window._csrf_token_,
            type: 'design-works'
        }
    ).done(function (data) {

        })

    //检测是否喜欢过
    $.get('/index/liked?id=' + window.designWorksId, function (boolean) {
        if (boolean) {
            $('.J-like').addClass('active').find('.J-text').html('已喜欢')
        }
    })

})
