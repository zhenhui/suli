/**
 * Created by songsong on 12/9/13.
 */

define(function (require, exports, module) {

    var form = document.forms['register']

    var S = KISSY

    var sha3 = require('sjplus/global/0.0.1/crypto/sha3')

    var $form = $(form)
    var ele = form.elements

    var emailRe = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/
    var userNameRe = /^[\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5A-Za-z0-9_-]{1,28}$/

    var $tipsWrapper = $('#tips-wrapper')
    var $tips = $tipsWrapper.find('.tips-content')

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
    }

    $form.on('keydown', function (ev) {
        console.log(ev.target)
        hideInfo()
    })

    $form.on('submit', function (ev) {

        ev.preventDefault()

        var _ = $.trim(ele['_'].value)                  //user name
        var __ = $.trim(ele['__'].value)                //email
        var ___ = ele['___'].value                      //password
        var captcha = ele['captcha'].value              //captcha
        var readRule = ele['read-rule']

        var err = []

        //validator user name
        if (!userNameRe.test(_)) {
            $(ele['_']).addClass('error')
            err.push('用户名不符合规则')
        }

        //validator email
        if (!emailRe.test(__)) {
            err.push('邮箱格式不正确')
            $(ele['__']).addClass('error')
        }

        //validator password
        if (!/^[^\s]{3,}$/.test(___)) {
            err.push('密码不符合规则')
            $(ele['___']).addClass('error')
        }

        //validator captcha
        if (!/^[^\s]{4}$/.test(captcha)) {
            err.push('验证码请输入正确')
            $(ele['___']).addClass('error')
        }

        //validator rule
        if (!readRule.checked || readRule.value !== 'yes') {
            err.push('请同意注册协议')
            $(ele['___']).addClass('error')
        }

        if (err.length > 0) {
            showInfo(S.map(err, function (str, index) {
                return '<p>' + (index + 1) + '：' + str + '</p>'
            }))
            console.log('register abort')
            return
        }


        $.ajax({
            url: form.action,
            type: 'post',
            data: {
                _: _,
                __: __,
                ___: sha3(___).toString(),
                captcha: form.elements['captcha'].value,
                readRule: readRule.checked && readRule.value,
                _csrf: window._csrf_token_
            },
            dataType: 'json'
        }).done(function (data) {

                var emailHost = __.substring(__.indexOf('@') + 1)

                if (data.status === 1) {
                    $('#submit-wrapper').slideUp(100, function () {
                        $('#submit-wrapper').remove()
                    })
                    $('.require-field').slideUp(100)

                    if (mailMap[emailHost]) {
                        showInfo('视界+发送了一封邮件到您的邮箱中， ' + '<a href="' + mailMap[emailHost] + '" style="text-decoration:underline;">现在就去验证!</a> ')
                    } else {
                        showInfo('<p>视界+发送了一封邮件到：' + __ + '。</p><p>如未找到，请检查垃圾邮箱中是否存在。</p>')
                    }
                    $tipsWrapper.addClass('success').slideDown()
                    return
                }

                reflushCaptcha()
                form.elements['captcha'].value = ''

                switch (data.status) {
                    case -1:
                        var str = []
                        S.each(data.err, function (obj) {
                            S.each(S.keys(obj), function (err) {
                                str.push('<p>' + obj[err] + '</p>')
                            })
                        })
                        showInfo(str.join(''))
                        break;
                    case -2:
                        showInfo('生成注册详情时出错')
                        break;
                    case -4:
                        showInfo('创建用户失败')
                        break;
                    case -5:
                        showInfo('无法发送注册邮件，请联系管理员')
                        break;
                    case -10:
                        showInfo('验证码错误')
                        break;
                }


            }).error(function () {
                reflushCaptcha()
                showInfo('服务器内部错误，请联系管理员。')

            })
    })


    function showInfo(txt) {
        $tips.html(txt)
        $tipsWrapper.slideDown()
    }

    function hideInfo() {
        $tipsWrapper.slideUp()
    }


    var $captchaTrigger = $('#captchaTrigger')
    $captchaTrigger.on('click', reflushCaptcha)

    function reflushCaptcha() {
        $captchaTrigger.find('img')[0].src = '/captcha?t=' + new Date().getTime()
    }


})
