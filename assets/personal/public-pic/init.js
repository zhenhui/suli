/**
 * Created by 松松 on 13-10-30.
 */

define(function (require, exports, module) {

    var template = require('template')
    var $container = $('#main-js-container')
    var publishTpl = require('./publish.tpl')
    require('./publish.css')
    var callback = module.id + '_uploadCallBack'

    exports.init = function () {
        $container.html(template.render(publishTpl, {}))
        var form = document.forms['upload-image-form']
        form.elements['callback-func-name'].value = callback
        //定义回调，上传完成后调用此处
        if (!window[callback]) {
            window[callback] = function () {
                getTuchuangList()
            }
        }
        getTuchuangList()
    }
    function getTuchuangList() {
        $.getJSON('/tuchuang/list?r' + Math.random(), function (docs) {
            var li = ''
            if (docs.data) {
                KISSY.each(docs.data, function (arr) {
                    li += '<li class="J-image-preview"><a href="' + window.imgCDN + '/read/' + arr._id + '" target="_blank">' +
                        '<img src="' + window.imgCDN + '/read/' + arr._id + '_preview">' +
                        '</a>' +
                        '<textarea class="J-image-preview-url" readonly>' +  window.imgCDN + '/read/' + arr._id + '</textarea>' +
                        '</li>'
                })
                $('#show-tuchuang-preview-trigger').html(li)
            }
        })
    }

    $container.on('mouseenter', '.J-image-preview-url', function (ev) {
        this.focus()
        this.select()
    })

})