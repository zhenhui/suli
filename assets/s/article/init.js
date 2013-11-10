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


    /*
     //先使用页面刷新方式，来做类目搜索
     var filter = {}

     KISSY.use('event,json', function (S, Event) {
     $categoryContainer.on('click', 'a.J-category', function (ev) {
     ev.preventDefault()
     filter.category = $(ev.currentTarget).data('category')
     location.hash = S.JSON.stringify(filter)
     })


     Event.on(window, 'hashchange', function () {

     })

     })

     function renderArticleList() {


     }*/

})