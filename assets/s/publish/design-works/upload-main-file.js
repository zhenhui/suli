/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-23
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var url = '/publish/design-works/save-main-file'
    var Uploader = require('sea/upload/upload')
    var $tip = $('.J-mail-file-status')

    var uploader = new Uploader({
        trigger: '#J-upload-file-triggers',
        name: 'file',
        action: url,
        data: {'_csrf': window._csrf_token_}
    }).change(function () {
            uploader.submit();
        }).success(function (response) {
            try {
                var serverInfo = $.parseJSON(response)
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
        });

})