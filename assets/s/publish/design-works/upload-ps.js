/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午8:53
 * 上传共享的缩略图
 */

define(function (require, exports, module) {

    var url = '/publish/design-works/save-ps'
    var $psList = $('#ps-list')
    var Uploader = require('sea/upload/upload')
    var psId
    var $psArr = $('#ps_id')
    var $ps

    var uploader = new Uploader({
        trigger: '#upload-ps',
        name: 'file',
        action: url,
        data: {'_csrf': window._csrf_token_}
    }).change(function (fileName) {
            psId = 'ps_file' + ( Math.random() * 100000000, 10)
            $psList.innerHTML = ''
            $('<div class="j-ps-file" id="' + psId + '">' + fileName + '<span class="J-process J-process-running">正在上传...</span></div>').appendTo($psList)
            $ps = $('#' + psId)
            uploader.submit();
        }).success(function (response) {
            try {
                var serverInfo = $.parseJSON(response)
                if (serverInfo._id && !serverInfo.err) {
                    $ps.addClass('J-success').data('id', serverInfo._id)
                    $ps.find('.J-process').html(' 上传成功')
                    $ps.find('.J-process-running').removeClass('J-process-running')
                    getPsList()
                } else {
                    $ps.find('.J-process').html('上传失败：' + serverInfo.err.join(','))
                }
            } catch (e) {
                $ps.find('.J-process').html('服务器异常' + response)
            }
        }).error(function (err) {
            $ps.find('.J-process').html('上传失败，请确认文件小于100Mb')
        });

    function getPsList() {
        $psArr.val('')
        //将上传成功的id  放置到textarea中
        var ps = []
        $psList.find('.J-success').each(function (i, item) {
            ps.push($(item).data('id'))
        })
        $psArr.val(ps.join('\r\n'))
    }


})