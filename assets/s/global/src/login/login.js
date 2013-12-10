/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */



define(function (require, exports, module) {

    var $loginNode = $('#login-register-area')
    var Popup = require('popup')
    var sha3 = require('sjplus/global/0.0.1/crypto/sha3')

    var S = KISSY

    $loginNode.mouseenter(function () {
        $loginNode.find('.J-spector').stop(true, true)
        $loginNode.find('.J-spector').animate({opacity: 0}, 200)
    }).mouseleave(function () {
            $loginNode.find('.J-spector').animate({opacity: 1}, 200)
        })

    var tpl = require('./login.tpl')

    var template = require('template')

    var loginCallBack = []

    //如果是登陆的FORM
    function loginFormSubmitFn(ev) {

        if (this.action.indexOf('/login') > -1) {
            ev.preventDefault();

            var user = $.trim(this.elements["user-name"].value)
            var pwd = $.trim(this.elements["pwd"].value)

            if (user.length < 2) {
                loginFail()
                return
            }

            if (pwd.length < 2) {
                loginFail()
                return
            }

            $.post("/login", {
                "_": user,
                __: sha3(pwd).toString(),
                _csrf: (function () {
                    return window._csrf_token_
                })()
            }, function (data) {

                if (data && data.userSessionNotice && S.keys(data.userSessionNotice).length > 0) {
                    window.location.reload()
                    return
                }

                updateCsrfToken(data._csrf_token_)

                switch (data.status) {
                    case 1:
                        loginSuccess(data)
                        break
                    case -1:
                        loginFail()
                        break
                    case -2:
                        loginFail()
                        break
                }

                for (var i = 0, length = loginCallBack.length; i < length; i++) {
                    loginCallBack.shift()(data)
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

    exports.login = function (callback) {
        popup.show()
        if (typeof callback === 'function') loginCallBack.push(callback)
    }

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


    function loginSuccess(data) {

        if (popup && popup.element) popup.element.fadeOut(100)

        var html = template.render(tpl, data)
        $loginNode.append($(html))


        $('.J-login-register-triggers').css({ marginTop: -19 })
        $('.login-user-info').css({top: 0})
        $('.login-user-info img').css({width: 20, height: 20, opacity: 1})
        initPersonMenu(data)

    }

    function loginFail() {

        var $loginDialog = $('#loginSmallDialog').stop()
        $loginDialog.animate({marginLeft: '-10'}, 80, function () {
            $loginDialog.animate({marginLeft: '10'}, 80, function () {
                $loginDialog.animate({marginLeft: '-10'}, 80, function () {
                    $loginDialog.animate({marginLeft: '10'}, 80, function () {
                        $loginDialog.animate({marginLeft: '-10'}, 80, function () {
                            $loginDialog.animate({marginLeft: '0'}, 80)
                        })
                    })
                })
            })
        })
    }

    $.ajax({
        url: '/login/is-login',
        data: {},
        dataType: 'jsonp'
    }).done(function (data) {
            $('#login-register-area').addClass('show')
            updateCsrfToken(data._csrf_token_)
            $(document).on('submit', 'form', loginFormSubmitFn)
            if (data.status == 1) {
                loginSuccess(data)
            }
        })

    function initPersonMenu(data) {
        new Popup({
            trigger: '.J-logged-list-triggers',
            triggerType: 'click',
            element: template.render(tpl, {_id: data._id, status: 'logged'}),
            delegateNode: document.body,
            effect: "slide"
        })
    }

    //更新页面上的token
    function updateCsrfToken(token) {
        window._csrf_token_ = token
        $('input[name=_csrf]').val(token)
    }

    exports.updateCsrfToken = updateCsrfToken

})
