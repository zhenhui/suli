/**
 * Created by 松松 on 13-10-14.
 */

define(function (require, exports, module) {


    KISSY.use("editor, editor/plugin/source-area," +
        "editor/plugin/font-size," +
        "editor/plugin/heading," +
        "editor/plugin/table," +
        "editor/plugin/image," +
        "editor/plugin/code", function (S, Editor, SourceArea, FontSize, Image, Code) {

        var cfg = {
            // 是否初始聚焦
            focused: true,
            attachForm: true,
            // 自定义样式
            // customStyle:"p{line-height: 1.4;margin: 1.12em 0;padding: 0;}",
            // 自定义外部样式
            // customLink:["http://localhost/customLink.css","http://xx.com/y2.css"],
            // render:"#container",
            render: '#editorEl',
            width: '100%',
            height: "400px"
        }

        cfg.plugins = [SourceArea, FontSize, new Image({
            upload: {
                serverUrl: "http://localhost/kissy_git/kissy/src/editor/demo/upload.php",
                suffix: "png,jpg,jpeg,gif",
                fileInput: "Filedata",
                sizeLimit: 1000, //k
                extraHtml: "<p style='margin-top:10px;'><input type='checkbox' id='ke_img_up_watermark_1' checked='checked'> 图片加水印，防止别人盗用</p>"
            }
        }), Code];
        var editor = new Editor(cfg).render();
        exports.editor = editor
    });
})
