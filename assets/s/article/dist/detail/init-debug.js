/**
 * Created by xiongsongsong on 12/5/13.
 */
define("sjplus/article/0.0.1/detail/init-debug", [ "sjplus/global/0.0.1/comment/comment-debug", "sjplus/global/0.0.1/like/init-debug" ], function(require, exports, module) {
    require("sjplus/global/0.0.1/comment/comment-debug");
    //控制浏览量
    $.post("/index/add-view", {
        id: window.articleId,
        _csrf: window._csrf_token_,
        type: "article"
    }).done(function(data) {});
    //加载喜欢组件
    require("sjplus/global/0.0.1/like/init-debug");
    //检测是否喜欢过
    $.get("/index/liked?id=" + window.articleId, function(boolean) {
        if (boolean) {
            $(".J-like").addClass("active").find(".J-text").html("已喜欢");
        }
    });
});
