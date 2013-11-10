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

    //生成一个回调函数名
    var callback = module.id + '_uploadCallBack'

    exports.init = function () {
        $.getJSON('/admin/user/get/personal-information?r' + Math.random(), function (docs) {
            if (docs.status > 0) {
                $container.html(template.render(tpl, docs))
                var form = document.forms['upload-image-form']
                form.elements['callback-func-name'].value = callback
                var $label = $(form).find('#upload-avatar-label')

                //定义回调，上传完成后调用此处
                if (!window[callback]) {
                    window[callback] = function (data) {
                        if (data.err) {
                            alert(data.err.join('\r\n'))
                        } else {
                            var src = window.imgCDN + "/avatar/" + data._id + '_80x80?r=' + Math.random()
                            $('#upload-image-preview')[0].src = src
                            $('#upload-avatar-id').val(data._id)
                            $('img.J-avatar-own-20').attr('src', "/avatar/" + data._id + '_20x20?r=' + Math.random())
                            $('img.J-avatar-own-80').attr('src', src)
                        }
                    }
                }
            } else {
                $container.html('登陆失效，请刷新页面重新登陆')
            }
        })
    }

    var sha3 = require('sha3')

    //更新密码
    $container.on('submit', 'form#admin-user-update-password', function (ev) {
        ev.preventDefault()
        var form = ev.currentTarget

        var p1 = form.elements['origin-pwd'].value
        var p2 = form.elements['new-pwd'].value
        var p3 = form.elements['confirm-pwd'].value

        if (p1 === '' || p2 !== p3) {
            alert('参数错误')
            return
        }
        p1 = sha3(p1).toString()
        p2 = sha3(p2).toString()

        $.post(form.action, {
            p1: p1,
            p2: p2,
            _csrf: window._csrf_token_
        }, function (data) {

            console.log(data)

        }, 'json')
    })

    //更新个人信息
    $container.on('submit', 'form#admin-user-information', function (ev) {
        ev.preventDefault()
        var form = ev.currentTarget
        $.post(form.action, $(ev.currentTarget).serialize(), function (data) {
            if (data.status > 0) {
                alert('更新成功')
            } else {
                alert('更新失败')
            }
        }, 'json')
    })

})
