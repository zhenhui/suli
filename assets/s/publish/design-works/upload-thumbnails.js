/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午8:53
 * 上传共享的缩略图
 */

define(function (require, exports, module) {

    var Uploader = require('sea/upload/upload')

    var url = '/publish/design-works/save-thumbnails'
    var $tip = $('.J-thumbnails-status')

    var uploader = new Uploader({
        trigger: '#upload_thumbnails',
        name: 'file',
        action: url,
        data: {'_csrf': window._csrf_token_}
    }).change(function (filename) {
            uploader.submit();
        }).success(function (response) {
            try {
                var data = $.parseJSON(response)
                if (data._id && !data.err) {
                    $('#thumbnails_id').val(data._id)
                    $tip.addClass('text-success').removeClass('text-error').html('上传成功')
                    //$('#thumbnails-preview').attr('src', window.imgCDN + '/read/' + data._id.split(':')[0]).addClass('block')
                } else {
                    $tip.addClass('text-error').removeClass('text-success').html('上传失败：' + data.err)
                }
            } catch (e) {
                alert('服务器出错')
            }
        });
})