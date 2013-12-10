/**
 * Created by songsong on 12/9/13.
 */

define(function (require, exports, module) {

    var form = document.forms['register']

    var sha3 = require('sjplus/global/0.0.1/crypto/sha3')

    var $form = $(form)
    var ele = form.elements

    var emailRe = /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    $form.on('submit', function (ev) {
        ev.preventDefault()

        var _ = $.trim(ele['_'].value)                  //user name
        var __ = $.trim(ele['__'].value)                //email
        var ___ = ele['___'].value                      //password
        var captcha = ele['captcha'].value              //captcha
        var readRule = ele['read-rule']

        var err = 0

        //validator user name
        if (!/^[\u4e00-\u9fa5a-z]{2,}$/.test(_)) {
            console.log('user name fail')
            $(ele['_']).addClass('error')
            err++
        }


        //validator email
        if (!emailRe.test(__)) {
            console.log('email fail')
            $(ele['__']).addClass('error')
            err++
        }

        //validator password
        if (!/^[^\s]{3,}$/.test(___)) {
            console.log('password fail')
            $(ele['___']).addClass('error')
            err++
        }
        //validator captcha
        if (!/^[^\s]{4}$/.test(captcha)) {
            console.log('captcha fail')
            $(ele['___']).addClass('error')
            err++
        }
        //validator rule
        if (!readRule.checked || readRule.value !== 'yes') {
            console.log('rule fail')
            $(ele['___']).addClass('error')
            err++
        }

        if (err > 0) {
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
                console.log(data)
            }).error(function () {
                alert('register error')
            })
    })

    var $captchaTrigger = $('#captchaTrigger')
    $captchaTrigger.on('click', reflushCaptcha)

    console.log($captchaTrigger)

    function reflushCaptcha(ev) {
        ev.preventDefault()
        $(this).find('img')[0].src = '/captcha?t=' + new Date().getTime()
    }


})
