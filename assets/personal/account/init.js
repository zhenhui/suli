/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午8:46
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var template = require('template')
    var tpl = require('./account.tpl')
    require('./account.css')
    var $container = $('#main-js-container')
    var callback = module.id + '_uploadCallBack'

    exports.init = function () {
        $container.html(tpl)
        var form = document.forms['upload-image-form']
        form.elements['callback-func-name'].value = callback
        var $label = $(form).find('#upload-avatar-label')

        //定义回调，上传完成后调用此处
        if (!window[callback]) {
            window[callback] = function (data) {
                if (data.err) {
                    alert(data.err.join('\r\n'))
                } else {
                    var src = "/avatar/" + data._id + '_80x80?' + Math.random()
                    $('#upload-image-preview')[0].src = src
                    $('#upload-avatar-id').val(data._id)
                    $('img.J-avatar80').attr('src', src)
                }
            }
        }
    }
})
