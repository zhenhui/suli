/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */



define(function (require, exports, module) {

    KISSY.use('dom,event,io', function () {
        var $loginNode = $('#login-register-area')
        var Popup = require('popup')
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
        function loginFormSubmitFn(ev) {

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
                    "_": user,
                    __: sha3(pwd).toString(),
                    _csrf: window._csrf_token_
                }, function (data) {
                    switch (data.status) {
                        case 1:
                            loginSuccess(data)
                            window.location.reload()
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

        }

        var popup = new Popup({
            trigger: '.J-login-triggers',
            triggerType: 'click',
            element: template.render(tpl, {status: '0'}),
            delegateNode: document.body,
            effect: "slide",
            align: {
                baseXY: [-180, -20]
            }
        })

        popup.render()
        //当点击登陆触点的时候
        $('#login-trigger').on('click', '.trigger', function (ev) {
            ev.preventDefault()
            var $this = $(this)
            $this.siblings().animate({opacity: 0}, 200)
            setTimeout(function () {
                $this.siblings().animate({ width: 0}, 300, function () {
                    $('div.login-small-dialog form').fadeIn(200, function (ev) {
                        $('#J-login-user-name-field').focus()
                    })
                })
            }, 100)
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

            $('.J-login-register-triggers').css({ marginTop: -19 })
            $('.login-user-info').css({top: 0})
            $('.login-user-info img').css({width: 20, height: 20, opacity: 1})
        }


        function loginFail(data) {

        }

        KISSY.jsonp(location.protocol + '//' + location.host + '/login/is-login', {}, function (data) {
            window._csrf_token_ = data._csrf_token_
            $(document).on('submit', 'form', loginFormSubmitFn)
            if (data.status == 1) {
                loginSuccess(data)
            } else {
                loginFail(data)
            }
        })
    })
})
