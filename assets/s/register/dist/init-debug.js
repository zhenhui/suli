/**
 * Created by songsong on 12/9/13.
 */
define("sjplus/register/0.0.1/init-debug", [ "sjplus/global/0.0.1/crypto/sha3-debug" ], function(require, exports, module) {
    var form = document.forms["register"];
    var S = KISSY;
    var sha3 = require("sjplus/global/0.0.1/crypto/sha3-debug");
    var $form = $(form);
    var ele = form.elements;
    var emailRe = /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var userNameRe = /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9]{2,}$/;
    var $tipsWrapper = $("#tips-wrapper");
    var $tips = $tipsWrapper.find(".tips-content");
    var mailMap = {
        "163.com": "http://mail.163.com/",
        "10086.cn": "http://mail.10086.cn/",
        "sohu.com": "http://mail.sohu.com/",
        "qq.com": "http://mail.qq.com/",
        "189.cn": "http://mail.189.cn/",
        "126.com": "http://www.126.com/",
        "gmail.com": "https://mail.google.com/",
        "sina.com": "http://mail.sina.com.cn/",
        "outlook.com": "http://www.outlook.com/",
        "aliyun.com": "http://mail.aliyun.com/",
        "tom.com": "http://mail.tom.com/",
        "sogou.com": "http://mail.sogou.com/",
        "2980.com": "http://www.2980.com/",
        "21cn.com": "http://mail.21cn.com/",
        "188.com": "http://www.188.com/",
        "yeah.net": "http://www.yeah.net/",
        "foxmail.com": "http://www.foxmail.com/",
        "wo.com.cn": "http://mail.wo.com.cn/",
        "263.net": "http://www.263.net/"
    };
    $form.on("submit", function(ev) {
        ev.preventDefault();
        var _ = $.trim(ele["_"].value);
        //user name
        var __ = $.trim(ele["__"].value);
        //email
        var ___ = ele["___"].value;
        //password
        var captcha = ele["captcha"].value;
        //captcha
        var readRule = ele["read-rule"];
        var err = 0;
        //validator user name
        if (!userNameRe.test(_)) {
            console.log("user name fail");
            $(ele["_"]).addClass("error");
            err++;
        }
        //validator email
        if (!emailRe.test(__)) {
            console.log("email fail");
            $(ele["__"]).addClass("error");
            err++;
        }
        //validator password
        if (!/^[^\s]{3,}$/.test(___)) {
            console.log("password fail");
            $(ele["___"]).addClass("error");
            err++;
        }
        //validator captcha
        if (!/^[^\s]{4}$/.test(captcha)) {
            console.log("captcha fail");
            $(ele["___"]).addClass("error");
            err++;
        }
        //validator rule
        if (!readRule.checked || readRule.value !== "yes") {
            console.log("rule fail");
            $(ele["___"]).addClass("error");
            err++;
        }
        if (err > 0) {
            console.log("register abort");
            return;
        }
        $.ajax({
            url: form.action,
            type: "post",
            data: {
                _: _,
                __: __,
                ___: sha3(___).toString(),
                captcha: form.elements["captcha"].value,
                readRule: readRule.checked && readRule.value,
                _csrf: window._csrf_token_
            },
            dataType: "json"
        }).done(function(data) {
            var emailHost = __.substring(__.indexOf("@") + 1);
            if (data.status === 1) {
                $("#submit-wrapper").slideUp(100, function() {
                    $("#submit-wrapper").remove();
                });
                $(".require-field").slideUp(100);
                if (mailMap[emailHost]) {
                    $tips.html("视界+发送了一封邮件到您的邮箱中， " + '<a href="' + mailMap[emailHost] + '" style="text-decoration:underline;">现在就去验证!</a> ');
                } else {
                    $tips.html("视界+发送了一封邮件到您的邮箱中，请点击里面的链接完成注册。");
                }
                return;
            }
            reflushCaptcha();
            switch (data.status) {
              case -1:
                var str = [];
                S.each(data.err, function(obj) {
                    S.each(S.keys(obj), function(err) {
                        str.push(obj[err]);
                    });
                });
                $tips.html(str.join(","));
                break;

              case -2:
                $tips.html("Fail: on insert register-list");
                break;

              case -4:
                $tips.html("create user fail");
                break;

              case -5:
                $tips.html("send mail fail");
                break;

              case -10:
                $tips.html("captcha fail");
                break;
            }
        }).error(function() {
            reflushCaptcha();
            $tips.html("Server Error");
        });
    });
    var $captchaTrigger = $("#captchaTrigger");
    $captchaTrigger.on("click", reflushCaptcha);
    function reflushCaptcha() {
        $captchaTrigger.find("img")[0].src = "/captcha?t=" + new Date().getTime();
    }
});
