/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-23
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var fileSize = 100 * 1024 * 1024

    var $pic = $('div.J-upload-file-triggers')

    var url = '/publish/design-works/save-main-file'

    //拖进
    $pic.bind('dragenter', function (e) {
        e.preventDefault()
    })

    //拖来拖去 , 一定要注意dragover事件一定要清除默认事件
    //不然会无法触发后面的drop事件
    $pic.bind('dragover', function (e) {
        $pic.addClass('dragover')
        e.preventDefault()
    })

    $pic.bind('dragleave', function (e) {
        $pic.removeClass('dragover')
    })

    //扔
    $pic.bind('drop', function (e) {
        $pic.removeClass('dragover')
        dropHandler(e)
    })

    var uploadQueue = []

    var dropHandler = function (e) {
        //将本地图片拖拽到页面中后要进行的处理都在这
        e.preventDefault()
        var fileList = e.originalEvent.dataTransfer.files

        if (e.originalEvent.dataTransfer.files.length > 1) {
            alert('您最多只能上传一个文件')
            return
        }

        Object.keys(fileList).forEach(function (item, index) {
            var f = fileList[item]
            if (!f.name) return
            if (index < 1) uploadQueue.push(f)
        })
        uploadImg()
    }

    var $tip = $('.J-mail-file-status')

    function uploadImg() {

        if (uploadQueue.length < 1) return
        var file = uploadQueue.shift()

        var formData = new FormData()

        formData.append('file', file)

        var xhr = new XMLHttpRequest()


        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                try {
                    var serverInfo = $.parseJSON(xhr.responseText)
                    if (serverInfo._id && !serverInfo.err) {
                        $('#main-file_id').val(serverInfo._id)
                        $('#main-file-preview').attr('src', window.imgCDN + '/read/' + serverInfo._id.split(':')[0])
                        $tip.addClass('text-success').removeClass('text-error').html('上传成功');
                    } else {
                        $tip.addClass('text-error').removeClass('text-success').html('上传失败：' + serverInfo.err);
                    }
                } catch (e) {
                    $tip.addClass('text-error').removeClass('text-success').html('上传失败');
                }
            }
        }

        xhr.open('post', url)
        xhr.upload.addEventListener("progress", function (evt) {
            var left = Math.round(evt.loaded * 100 / evt.total) + '%'
            $tip.removeClass('text-success text-error').html('上传中：' + left)
            if (left === '100%') {
                $tip.html('上传完成，等待结果中....')
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

    var $uploadMainFile = $('#main-file-field')
    $uploadMainFile.on('change', function (ev) {
        var files = ev.target.files

        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            files.id = $uploadMainFile.attr('id')
            uploadQueue.push(file)
        }

        uploadImg()
    })

    var loadImageCl = 0

    function getImageUrl(_id) {

    }

})