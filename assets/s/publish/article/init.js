/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-4
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    //上传缩略图
    require('./upload-thumbnails')
    var Editor = require('./editor')


    var form = document.forms['publish']
    $(form).on('submit', function (ev) {

        ev.preventDefault()

        if (Editor && Editor.editor) {
            form.elements['content'].value = Editor.editor.getData()
        }

        $.post("/publish/article/save", $(form).serialize(), function (data) {
            if (data && data.docs) {
                window.location.href = '/personal#all-works'
            } else {
                alert('遇到错误:\r\n' + data.err.join('\r\n'))
            }
        });
    })
})