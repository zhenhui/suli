/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/global/0.0.1/login/login-debug", [ "popup-debug", "sjplus/global/0.0.1/crypto/sha3-debug", "./login-debug.tpl", "template-debug" ], function(require, exports, module) {
    var $loginNode = $("#login-register-area");
    var Popup = require("popup-debug");
    var sha3 = require("sjplus/global/0.0.1/crypto/sha3-debug");
    var S = KISSY;
    $loginNode.mouseenter(function() {
        $loginNode.find(".J-spector").stop(true, true);
        $loginNode.find(".J-spector").animate({
            opacity: 0
        }, 200);
    }).mouseleave(function() {
        $loginNode.find(".J-spector").animate({
            opacity: 1
        }, 200);
    });
    var tpl = require("./login-debug.tpl");
    var template = require("template-debug");
    var loginCallBack = [];
    //如果是登陆的FORM
    function loginFormSubmitFn(ev) {
        if (this.action.indexOf("/login") > -1) {
            ev.preventDefault();
            var user = $.trim(this.elements["user-name"].value);
            var pwd = $.trim(this.elements["pwd"].value);
            if (user.length < 2) {
                loginFail();
                return;
            }
            if (pwd.length < 2) {
                loginFail();
                return;
            }
            $.post("/login", {
                _: user,
                __: sha3(pwd).toString(),
                _csrf: function() {
                    return window._csrf_token_;
                }()
            }, function(data) {
                var length = loginCallBack.length;
                for (var i = 0; i < length; i++) {
                    loginCallBack[i](data);
                }
                updateCsrfToken(data._csrf_token_);
                switch (data.status) {
                  case 1:
                    if (loginCallBack.length < 1) location.reload(true);
                    break;

                  case -1:
                    loginFail();
                    break;

                  case -2:
                    loginFail();
                    break;
                }
            }, "json");
        }
    }
    //Login trigger
    var popup = new Popup({
        trigger: ".J-login-triggers",
        triggerType: "click",
        element: template.render(tpl, {}),
        delegateNode: document.body,
        effect: "slide",
        align: {
            baseXY: [ -180, -20 ]
        }
    });
    exports.loginPopup = popup;
    exports.login = function(callback) {
        popup.show();
        if (typeof callback === "function") loginCallBack.push(callback);
    };
    //当点击登陆触点的时候
    $("#login-trigger").on("click", ".trigger", function(ev) {
        ev.preventDefault();
        var $this = $(this);
        $this.siblings().animate({
            opacity: 0
        }, 200);
        setTimeout(function() {
            $this.siblings().animate({
                width: 0
            }, 300, function() {
                $("div.login-small-dialog form").fadeIn(200, function(ev) {
                    $("#J-login-user-name-field").focus();
                });
            });
        }, 100);
    });
    popup.on("animated", function() {
        $("#J-login-user-name-field").focus();
    });
    function loginSuccess(data) {
        if (popup && popup.element) popup.element.fadeOut(100);
        initPersonMenu(data);
    }
    function loginFail() {
        var $loginDialog = $("#loginSmallDialog").stop();
        $loginDialog.animate({
            marginLeft: "-10"
        }, 80, function() {
            $loginDialog.animate({
                marginLeft: "10"
            }, 80, function() {
                $loginDialog.animate({
                    marginLeft: "-10"
                }, 80, function() {
                    $loginDialog.animate({
                        marginLeft: "10"
                    }, 80, function() {
                        $loginDialog.animate({
                            marginLeft: "-10"
                        }, 80, function() {
                            $loginDialog.animate({
                                marginLeft: "0"
                            }, 80);
                        });
                    });
                });
            });
        });
    }
    $.ajax({
        url: "/login/is-login",
        data: {},
        dataType: "jsonp"
    }).done(function(data) {
        updateCsrfToken(data._csrf_token_);
        $(document).on("submit", "form", loginFormSubmitFn);
        if (data.status == 1) {
            loginSuccess(data);
        }
    });
    function initPersonMenu(data) {
        new Popup({
            trigger: ".J-logged-list-triggers",
            triggerType: "click",
            element: $("#logged-wrapper").html(),
            delegateNode: document.body,
            effect: "slide",
            align: {}
        });
    }
    //更新页面上的token
    function updateCsrfToken(token) {
        window._csrf_token_ = token;
        $("input[name=_csrf]").val(token);
    }
    exports.updateCsrfToken = updateCsrfToken;
});

define("sjplus/global/0.0.1/login/login-debug.tpl", [], '<div id="loginSmallDialog" class="login-small-dialog">\n    <div class="wrapper">\n\n        <h2>登 陆</h2>\n\n        <div id="login-trigger">\n            <div class="trigger">\n                <a id="domain-login"><span><!--域帐号--></span></a>\n            </div>\n            <!--<div class="trigger">\n                <a id="email-login"><span>邮箱登陆</span></a>\n            </div>-->\n            <!--<div class="trigger">\n                <a id="weibo-login"><span>微博登陆</span></a>\n            </div>-->\n\n        </div>\n\n        <form action="/login" method="post">\n            <input class="text" type="text" name="user-name" placeholder="用户名" id="J-login-user-name-field">\n            <input class="text" type="password" name="pwd" placeholder="密码">\n            <input class="btn J-login-submit-triggers" type="submit" value="登陆"/>\n        </form>\n    </div>\n</div>\n');
