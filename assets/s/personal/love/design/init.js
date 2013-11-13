/**
 * Created by 松松 on 13-10-15.
 */

define(function (require, exports, module) {

    var tpl = require('./design.tpl')

    require('./design.css')

    var template = require('template')

    var $container
    exports.init = function () {
        console.log('设计作品开始加载')
        $container = $('#tab-container')
        $container.innerHTML = '加载中'
        $.getJSON('/design-works/index/like/json/list?r=' + Math.random(), function (data) {
            $container.html(template.render(tpl, {data: data}))
        })
    }

    var Popup = require('popup')

    var deletePopup = new Popup({
        trigger: '.J-unlike-design-works',
        element: '<div><div class="t">确定取消喜欢？</div><div class="control">' +
            '<a href="javascript:void(0)"  class="J-unlike-design-works-of-own-trigger" data-action="delete">确定</a>' +
            '<a href="javascript:void(0)" class="J-cancel">关闭</a>' +
            '</div></div>',
        id: 'unlike-design-works-of-own-trigger',
        delegateNode: '#main-js-container',
        triggerType: 'click',
        className: 'unlike-design-work',
        effect: 'fade',
        align: {
            baseXY: [-20, -20]
        }
    })

    deletePopup.render()

    deletePopup.after('show', function (ev) {
        ev.element.find('.J-unlike-design-works-of-own-trigger').data('id', ev.activeTrigger.attr('data-id'))
    })

    //取消喜欢
    $('#' + deletePopup.get('id')).on('click', '.J-unlike-design-works-of-own-trigger', function (ev) {
        ev.preventDefault()
        var id = $(ev.currentTarget).data('id')
        $.get('/design-works/index/unlike', {id: $(ev.currentTarget).data('id')}, function (data) {
            var $li = $('#J-design-works-' + id)
            $li.fadeOut(function () {
                $li.remove()
            })
            deletePopup.hide()
        })
    })
    $('#' + deletePopup.get('id')).on('click', '.J-cancel', function () {
        deletePopup.hide()
    })
})
