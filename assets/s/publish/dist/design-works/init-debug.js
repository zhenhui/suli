/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-4
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/publish/0.0.1/design-works/init-debug", [ "./upload-main-file-debug", "sea/upload/upload-debug", "./upload-thumbnails-debug", "./tag-debug" ], function(require, exports, module) {
    //上传主图
    require("./upload-main-file-debug");
    //上传缩略图
    require("./upload-thumbnails-debug");
    //上传附件
    //require('./upload-ps')
    //标签
    require("./tag-debug");
    var form = document.forms["publish"];
    $(document.forms["publish"]).on("submit", function(ev) {
        ev.preventDefault();
        if ($(form).find(".J-process-running").length > 0) {
            alert("请稍等，文件正在上传");
            return;
        }
        $.post("/publish/design-works/save", $(form).serialize(), function(data) {
            if (data && data.docs) {
                window.location.href = '/personal#all-works{"view":"design"}';
            } else {
                alert("遇到错误:\r\n" + data.err.join("\r\n"));
                switch (data.errType) {
                  case "category":
                    form.elements["category"].focus();
                    break;
                }
            }
        });
    });
});

/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-23
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/publish/0.0.1/design-works/upload-main-file-debug", [ "sea/upload/upload-debug" ], function(require, exports, module) {
    var url = "/publish/design-works/save-main-file";
    var Uploader = require("sea/upload/upload-debug");
    var $tip = $(".J-mail-file-status");
    var uploader = new Uploader({
        trigger: "#J-upload-file-triggers",
        name: "file",
        action: url,
        data: {
            _csrf: window._csrf_token_
        }
    }).change(function() {
        uploader.submit();
    }).success(function(response) {
        try {
            var serverInfo = $.parseJSON(response);
            if (serverInfo._id && !serverInfo.err) {
                $("#main-file_id").val(serverInfo._id);
                $("#main-file-preview").attr("src", window.imgCDN + "/read/" + serverInfo._id.split(":")[0]);
                $tip.addClass("text-success").removeClass("text-error").html("上传成功");
            } else {
                $tip.addClass("text-error").removeClass("text-success").html("上传失败：" + serverInfo.err);
            }
        } catch (e) {
            $tip.addClass("text-error").removeClass("text-success").html("上传失败");
        }
    });
});

/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-10
 * Time: 下午8:53
 * 上传共享的缩略图
 */
define("sjplus/publish/0.0.1/design-works/upload-thumbnails-debug", [ "sea/upload/upload-debug" ], function(require, exports, module) {
    var Uploader = require("sea/upload/upload-debug");
    var url = "/publish/design-works/save-thumbnails";
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
            } else {
                $tip.addClass("text-error").removeClass("text-success").html("上传失败：" + data.err);
            }
        } catch (e) {
            alert("服务器出错");
        }
    });
});

/**
 * Created by 松松 on 13-12-4.
 */
define("sjplus/publish/0.0.1/design-works/tag-debug", [], function(require, exports, module) {
    var S = KISSY;
    //tag总容器
    var $tag = $("#tag");
    //tag输入框
    var $tagInput = $("#tag-field");
    //包裹tag的容器
    var $tagControl = $("#tag-control");
    //存放tag以提交给服务器
    var $tagValue = $("#tag-value");
    require.async("/go/design-works/tag?r=" + S.now() + "&callback=define", function(data) {
        var str = S.map(data.replace(/\s/gim, "").split(/[，,]/), function(tag) {
            return '<option value="' + tag + '"></option>';
        });
        $("#tagList").html(str);
    });
    var tagCache = {};
    var re = /^[\u4e00-\u9fa5A-Za-z0-9]{2,}$/;
    $tagInput.on("keydown", function(ev) {
        setTimeout(function() {
            var val = $tagInput.val();
            if (val.replace(/\s/g, "").length > 0 && (val.substring(val.length - 3) === "   " || ev.type === "blur")) {
                //检测标签是否符合规则
                if (re.test(S.trim(val))) {
                    updateTag($tagInput.val());
                    $tagInput.val("");
                    console.log(val + "符合规则");
                } else {
                    console.log(val + "不符合规则");
                }
            }
        }, 0);
    });
    //当失去焦点
    $tagInput.on("blur", function(ev) {
        var val = S.trim($tagInput.val());
        S.each(val.split(" "), function(tag) {
            if (re.test(tag)) {
                updateTag(tag);
            }
        });
        $tagInput.val("");
    });
    //删除标签
    $tagControl.on("click", ".J-delete", function(ev) {
        ev.preventDefault();
        var text = $(ev.currentTarget).data("text");
        delete tagCache[text];
        $(ev.currentTarget).parents(".J-tag").remove();
        $tagValue.val(S.keys(tagCache).join(" "));
    });
    $tag.on("click", function(ev) {
        if (ev.target === $tag[0]) $tagInput.focus();
    });
    function updateTag(val) {
        //对于已经存在的tag，予以删除
        val = S.trim(val);
        if (!re.test(val)) return;
        if (tagCache[val]) return;
        tagCache[val] = val;
        $('<a class="tag J-tag">' + val + '<span class="delete J-delete" data-text="' + val + '">&times;</span></a>').appendTo($tagControl);
        $tagValue.val(S.keys(tagCache).join(" "));
    }
    exports.tag = tagCache;
});
