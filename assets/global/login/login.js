/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */



define(function (require, exports, module) {

    var $loginNode = $('#login-register-area')
    var Popup = require('arale/popup/1.1.5/popup')
    var sha3 = require('sha3')

    $loginNode.mouseenter(function () {
        $loginNode.find('.J-spector').stop(true, true)
        $loginNode.find('.J-spector').animate({opacity: 0}, 200)
    }).mouseleave(function () {
            $loginNode.find('.J-spector').animate({opacity: 1}, 200)
        })

    var tpl = require('./login.tpl')

    var template = require('template')


    //如果是登陆的FORM
    $(document).on('submit', 'form', function (ev) {

        if (this.action.indexOf('/login') > -1) {
            ev.preventDefault();

            var user = $.trim(this.elements["user-name"].value)
            var pwd = $.trim(this.elements["pwd"].value)

            if (user.length < 2) {
                alert('用户名长度太短，至少2个字符')
                return
            }

            if (pwd.length < 2) {
                alert('密码必须大于3位')
                return
            }

            $.post("/login", {
                "_": sha3(user).toString() + sha3(pwd).toString()
            }, function (data) {
                switch (data.status) {
                    case 1:
                        loginSuccess(data)
                        break
                    case -1:
                        loginFail(data)
                        break
                    case -2:
                        loginFail(data)
                        break
                }
            }, 'json')
        }

    })

    var popup = new Popup({
        trigger: '.J-login-triggers',
        triggerType: 'click',
        element: template.render(tpl, {status: '0'}),
        delegateNode: document.body,
        effect: "slide"
    })

    popup.on('animated', function () {
        $('#J-login-user-name-field').focus()
    })

    new Popup({
        trigger: '.J-logged-list-triggers',
        triggerType: 'click',
        element: template.render(tpl, {status: 'logged'}),
        delegateNode: document.body,
        effect: "slide"
    })


    function loginSuccess(data) {

        if (popup && popup.element) popup.element.fadeOut(100)

        var html = template.render(tpl, data)
        $loginNode.append($(html))

        $('.J-login-register-triggers').animate({
            marginTop: -19
        }, 100, function () {
            $('.login-user-info').animate({top: 0}, 100)
            $('.login-user-info img').css('opacity', 0).animate({width: 20, height: 20, opacity: 1})
        })
    }


    function loginFail(data) {

    }

    $.getJSON('/login/is-login?r=' + Math.random(), function (data) {
        if (data.status == 1) {
            loginSuccess(data)
        } else {
            loginFail(data)
        }
    })

})