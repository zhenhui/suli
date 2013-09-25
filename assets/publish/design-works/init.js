/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-4
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    //上传主图
    require('./upload-main-file')
    //上传缩略图
    require('./upload-thumbnails')
    //上传附件
    require('./upload-ps')

    var form = document.forms['publish']
    $(document.forms['publish']).on('submit', function (ev) {
        $.post("/publish/design-works/save", $(form).serialize(), function (data) {
            if (data && data.docs) {
                window.location.href = '/personal#manage-share'
            } else {
                alert('遇到错误:\r\n' + data.err.join('\r\n'))
            }
        });
        ev.preventDefault()
    })

})