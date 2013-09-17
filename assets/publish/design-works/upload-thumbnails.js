/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午8:53
 * 上传共享的缩略图
 */

define(function (require, exports, module) {

    //缩略图上限为1Mb
    var fileSize = 1 * 1024 * 1024

    var url = '/publish/design-works/save-thumbnails'

    var uploadQueue = []

    function uploadImg() {

        if (uploadQueue.length < 1) return
        var file = uploadQueue.shift()

        var formData = new FormData()

        formData.append('file', file)

        var xhr = new XMLHttpRequest()

        var $tip = $('.J-thumbnails-status')

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                try {
                    var serverInfo = $.parseJSON(xhr.responseText)
                    if (serverInfo._id && !serverInfo.err) {
                        $('#thumbnails_id').val(serverInfo._id)
                        $tip.addClass('text-success').removeClass('text-error').html('上传成功')
                        $('#thumbnails-preview').attr('src', '/read/' + serverInfo._id.split(':')[0]).addClass('block')
                    } else {
                        $tip.addClass('text-error').removeClass('text-success').html('上传失败：' + serverInfo.err)
                    }
                } catch (e) {

                }
            }
        }

        xhr.open('post', url)
        xhr.upload.addEventListener("progress", function (evt) {
            var left = Math.round(evt.loaded * 100 / evt.total) + '%'
            if (left === '100%') {
            }
        }, false)

        //检测文件大小
        if (file.size > 0 && file.size < fileSize) {
            xhr.send(formData)
        } else {
            xhr.abort()
        }
        if (uploadQueue.length > 0) uploadImg()
    }

    var $uploadFileField = $('#upload-thumbnails')
    $uploadFileField.on('change', function (ev) {
        var files = ev.target.files

        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            files.id = $uploadFileField.attr('id')
            uploadQueue.push(file)
        }

        uploadImg()
    })

})