/**
 * Created by 松松 on 13-11-10.
 */

define(function (require, exports, module) {

    var category = require('./category')
    var template = require('template')
    var tpl = require('./category.tpl')
    var $categoryContainer = $('#category-container')

    //加载侧边分类
    category.getCategoryResult(function (result) {
        $('#category-container').html(template.render(tpl, {data: result}))
        var category = KISSY.unparam(location.search.substring(1))
        KISSY.each(KISSY.keys(category), function (item) {
            $categoryContainer.find('[data-category="' + category[item] + '"]').addClass('active')
        })
    })

    require('s/global/comment/comment')

    //控制浏览量
    $.post('/index/add-view', {
            id: window.articleId,
            _csrf: window._csrf_token_,
            type: 'article'
        }
    ).done(function (data) {

        })


    //加载喜欢组件
    require('s/global/like/init')

    //检测是否喜欢过
    $.get('/index/liked?id=' + window.articleId, function (boolean) {
        if (boolean) {
            $('.J-like').addClass('active').find('.J-text').html('已喜欢')
        }
    })

})