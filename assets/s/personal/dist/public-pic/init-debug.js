/**
 * Created by 松松 on 13-10-30.
 */
define("sjplus/personal/0.0.1/public-pic/init-debug", [ "template-debug", "./publish-debug.tpl", "./publish-debug.css" ], function(require, exports, module) {
    var template = require("template-debug");
    var $container = $("#main-js-container");
    var publishTpl = require("./publish-debug.tpl");
    require("./publish-debug.css");
    var callback = module.id + "_uploadCallBack";
    exports.init = function() {
        $container.html(template.render(publishTpl, {}));
        var form = document.forms["upload-image-form"];
        form.elements["callback-func-name"].value = callback;
        //定义回调，上传完成后调用此处
        if (!window[callback]) {
            window[callback] = function() {
                getTuchuangList();
            };
        }
        getTuchuangList();
    };
    function getTuchuangList() {
        $.getJSON("/tuchuang/list?r" + Math.random(), function(docs) {
            var li = "";
            if (docs.data) {
                KISSY.each(docs.data, function(arr) {
                    li += '<li class="J-image-preview"><a href="' + window.imgCDN + "/read/" + arr._id + '" target="_blank">' + '<img src="' + window.imgCDN + "/read/" + arr._id + '_preview">' + "</a>" + '<textarea class="J-image-preview-url" readonly>' + window.imgCDN + "/read/" + arr._id + "</textarea>" + "</li>";
                });
                $("#show-tuchuang-preview-trigger").html(li);
            }
        });
    }
    $container.on("mouseenter", ".J-image-preview-url", function(ev) {
        this.focus();
        this.select();
    });
});

define("sjplus/personal/0.0.1/public-pic/publish-debug.tpl", [], '<div id="upload-pic">\n    <div class="container"><h3>图床，仅供内部或首页使用，不对外开放</h3>\n\n        <form target="upload-image" enctype="multipart/form-data" id="upload-image-form" data-callback-id=""\n              method="post" action="/upload/tuchuang">\n            <input type="hidden" name="_csrf" value="#{window._csrf_token_}" />\n            <input type="file" class="btn btn-large" name="file">\n            <input type="hidden" name="callback-func-name"/>\n            <input type="hidden" id="upload-avatar-id" name="result-field">\n            <input type="submit" class="btn btn-large" value="开始上传图像（500k以内）">\n        </form>\n        <h3>List Ctrl+C copy to ClipBoard</h3>\n\n        <div class="list">\n            <ul class="J-image" id="show-tuchuang-preview-trigger"></ul>\n        </div>\n    </div>\n</div>\n');

define("sjplus/personal/0.0.1/public-pic/publish-debug.css", [], function() {
    seajs.importStyle("#show-tuchuang-preview-trigger{line-height:230%}#show-tuchuang-preview-trigger li{display:inline-block;height:140px;vertical-align:top;margin:5px;width:138px;text-align:center;box-shadow:0 0 2px #ccc;border-radius:2px}#show-tuchuang-preview-trigger li img{display:inline-block;vertical-align:middle}#show-tuchuang-preview-trigger li:hover{position:relative;box-shadow:0 0 2px #ff3b35}#show-tuchuang-preview-trigger li textarea{position:absolute;left:0;bottom:12px;opacity:0;color:#fff;background:#ff3b35;border:0;padding:3px 6px;overflow:hidden;height:auto;resize:none;width:150px;outline:0}#show-tuchuang-preview-trigger li:hover textarea{opacity:.9}");
});
