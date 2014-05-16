
define(function (require, exports, module) {

    var form = document.forms['add-user'];
    var $form = $(form);
    var sha3 = require('sjplus/global/0.0.1/crypto/sha3')

    $form.on('submit', function (ev) {

        ev.preventDefault();

        var user = $.trim(form.elements['user-name'].value)
        var pwd1 = $.trim(form.elements['pwd1'].value)
        var pwd2 = $.trim(form.elements['pwd2'].value)
        var group = $.trim(form.elements['group'].value)


        if (user.length < 2) {
            alert('用户名太短')
            return
        }

        if (pwd1.length < 3 || pwd2.length < 3) {
            alert('密码不能少于3位')
            return
        }

        if (pwd1 !== pwd2) {
            alert('两次密码不一致')
            return
        }

        pwd1 = sha3(pwd1).toString()

        $.post(form.action, {
            _: user,
            __: pwd1,
            group: group,
            _csrf: window._csrf_token_
        }, function (data) {
            if (data.success) {
                window.location.reload()
            } else {
                alert(data.msg)
            }
        }, 'json');

    })


    var $editUser = $('#edit-user')

    $editUser.on('click', '.J-update-user', function (ev) {
        ev.preventDefault()
        var $this = $(this)
        var $tr = $this.parents('tr')
        var id = $tr.data('id')
        var group = $tr.find('.J-group').val()

        $.post('/admin/user/update/group', {
            id: id,
            group: group,
            _csrf: window._csrf_token_
        }, function (data) {
        }, 'json');
    })

    //拉取Git
    $(document).on('click', '.J-git-pull', function () {
        $('#gitPullResult').val('please wait ...')
        $.get('/admin/system/git-pull?r=' + Math.random(), function (text) {
            $('#gitPullResult').val(text)
        })
    })

    //拉取Git
    $(document).on('click', '.J-result-pm2-id', function () {
        $('#restartPM2idResult').val('please wait ...')
        var id = $('#pm2id').val()
        $.get('/admin/system/pm2-restart', {
            r: Math.random(),
            pm2id: id
        }).done(function (text) {
                if (text) {
                    $('#restartPM2idResult').val(text)
                } else {
                    $('#restartPM2idResult').val('重启貌似没有成功，请等5秒后刷新页面，或赶紧联系管理员')
                }
            }).error(function () {
                $('#restartPM2idResult').val('连接已断开，说明：' + id + '进程正在重启中，一般耗时在5秒内')
            })
    })
})