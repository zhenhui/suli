/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午8:53
 * 上传共享的缩略图
 */

define(function (require, exports, module) {

    var url = '/publish/design-works/save-ps'

    var uploadQueue = []

    var fileSize = 100 * 1024 * 1024

    var $psList = $('#ps-list')

    function uploadImg() {

        if ($psList.find('div.J-ps-success,div.J-process-running').size() >= 3) {
            alert('最多只允许上传3个附件')
            return
        }

        if (uploadQueue.length < 1) return
        var file = uploadQueue.shift()

        var formData = new FormData()

        formData.append('file', file)

        var xhr = new XMLHttpRequest()

        //每一个上传文件的DOM节点
        var id = 'ps-' + (new Date().getTime()).toString() + (Math.random().toString().substring(3))
        //节点的引用
        var $ps

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                $ps.removeClass('J-process-running')
                try {
                    var serverInfo = $.parseJSON(xhr.responseText)

                    if (serverInfo._id && !serverInfo.err) {
                        $('#ps_id').val($('#ps_id').val() + serverInfo._id + '\r\n')
                        $ps.addClass('J-ps-success')
                        $ps.append('<a class="J-delete" data-id="' + serverInfo._id + '">删除文件</a>')
                        $ps.find('.J-process').remove()
                    } else {
                        $ps('上传失败：' + serverInfo.err.join(','))
                    }
                } catch (e) {
                    $ps('服务器异常')
                }
            }
        }

        xhr.open('post', url)
        xhr.upload.addEventListener("progress", function (evt) {
            var left = Math.round(evt.loaded * 100 / evt.total) + '%'
            $ps.find('.J-process').html(left)
            if (left === '100%') {
                $ps.find('.J-process').html('上传完成，服务器处理中...')
                $ps.find('.J-cancel').remove()
            }
        }, false)

        //检测文件大小
        if (file.size > 0 && file.size < fileSize) {
            xhr.send(formData)
            showPsList(xhr, file, id)
            $ps = $('#' + id)

        } else {
            alert('文件体积太大，上限为：' + (fileSize / 1024 / 1024) + 'Mb')
            xhr.abort()
        }
        if (uploadQueue.length > 0) uploadImg()
    }

    //删除文件
    $psList.on('click', '.J-delete', function (ev) {
        var $this = $(this)
        var id = $(this).data('id')
        $this.parent('.J-ps').remove()
        $.get('/publish/design-works/delete', {
            id: id
        }, function (data) {
            console.log(data)
        })

    })

    function showPsList(xhr, file, id) {
        $psList.append('<div id="' + id + '" class="J-ps J-process-running"><span class="J-process"></span>' + file.name + '<a class="J-cancel">取消上传</a></div>')
    }

    var $uploadPS = $('#upload-ps')
    $uploadPS.on('change', function (ev) {
        var files = ev.target.files

        if ($psList.find('div.J-ps,div.J-process-running').size() > 3) {
            alert('最多只允许上传3个附件')
            return
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            files.id = $uploadPS.attr('id')
            uploadQueue.push(file)
        }

        uploadImg()
    })

})