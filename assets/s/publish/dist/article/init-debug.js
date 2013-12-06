/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-4
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/publish/0.0.1/article/init-debug", [ "./upload-thumbnails-debug", "sea/upload/upload-debug", "./editor-debug" ], function(require, exports, module) {
    //上传缩略图
    require("./upload-thumbnails-debug");
    var Editor = require("./editor-debug");
    var form = document.forms["publish"];
    $(form).on("submit", function(ev) {
        ev.preventDefault();
        if (Editor && Editor.editor) {
            form.elements["content"].value = Editor.editor.getData();
        }
        $.post("/publish/article/save", $(form).serialize(), function(data) {
            if (data && data.docs) {
                window.location.href = '/personal#all-works{"view":"article"}';
            } else {
                alert("遇到错误:\r\n" + data.err.join("\r\n"));
            }
        });
    });
});

/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午8:53
 * 上传共享的缩略图
 */
define("sjplus/publish/0.0.1/article/upload-thumbnails-debug", [ "sea/upload/upload-debug" ], function(require, exports, module) {
    var url = "/publish/article/save-article-banner";
    var Uploader = require("sea/upload/upload-debug");
    var $tip = $(".J-thumbnails-status");
    var uploader = new Uploader({
        trigger: "#upload_thumbnails",
        name: "file",
        action: url,
        data: {
            _csrf: window._csrf_token_
        }
    }).change(function(filename) {
        uploader.submit();
    }).success(function(response) {
        try {
            var data = $.parseJSON(response);
            if (data._id && !data.err) {
                $("#thumbnails_id").val(data._id);
                $tip.addClass("text-success").removeClass("text-error").html("上传成功");
                $("#thumbnails-preview").attr("src", window.imgCDN + "/read/" + data._id.split(":")[0]).addClass("block");
            } else {
                $tip.addClass("text-error").removeClass("text-success").html("上传失败：" + data.err);
            }
        } catch (e) {
            alert("服务器出错");
        }
    });
});

/**
 * Created by 松松 on 13-10-14.
 */
define("sjplus/publish/0.0.1/article/editor-debug", [], function(require, exports, module) {
    KISSY.use("editor, editor/plugin/source-area," + "editor/plugin/font-size," + "editor/plugin/heading," + "editor/plugin/table," + "editor/plugin/image," + "editor/plugin/code", function(S, Editor, SourceArea, FontSize, Image, Code) {
        var cfg = {
            // 是否初始聚焦
            focused: true,
            attachForm: true,
            // 自定义样式
            // customStyle:"p{line-height: 1.4;margin: 1.12em 0;padding: 0;}",
            // 自定义外部样式
            // customLink:["http://localhost/customLink.css","http://xx.com/y2.css"],
            // render:"#container",
            render: "#editorEl",
            width: "100%",
            height: "400px"
        };
        cfg.plugins = [ SourceArea, FontSize, new Image({
            upload: {
                serverUrl: "http://localhost/kissy_git/kissy/src/editor/demo/upload.php",
                suffix: "png,jpg,jpeg,gif",
                fileInput: "Filedata",
                sizeLimit: 1e3,
                //k
                extraHtml: "<p style='margin-top:10px;'><input type='checkbox' id='ke_img_up_watermark_1' checked='checked'> 图片加水印，防止别人盗用</p>"
            }
        }), Code ];
        var editor = new Editor(cfg).render();
        exports.editor = editor;
    });
});
