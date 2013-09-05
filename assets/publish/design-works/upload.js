/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-23
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $pic = $('div.J-upload-file-triggers')

    var url = '/publish/design-works/save-file'


    //拖进
    $pic.bind('dragenter', function (e) {
        e.preventDefault()
    })

    //存储上传成功的文件
    var uploadList = []

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

    var fileSize = 1500000 * 1024 * 1024

    function uploadImg() {

        if (uploadQueue.length < 1) return
        var file = uploadQueue.shift()

        var formData = new FormData()

        formData.append('file', file)

        var xhr = new XMLHttpRequest()


        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                try {
                    var serverInfo = JSON.parse(xhr.responseText)
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


    exports.getUploadList = function () {
        return uploadList
    }

    exports.clearUploadList = function () {
        uploadList = []
    }


})