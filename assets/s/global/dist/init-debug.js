/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-27
 * Time: 下午9:18
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/global/0.0.1/init-debug", [], function(require, exports, module) {
    KISSY.ready(function() {
        $('<div id="feedback"><h4>反馈</h4>' + '<div><a id="feedback1" href="">1：页面、优化、功能性建议</a><br>hangzhenhui@beyondsoft.com</div>' + '<div><a id="feedback2" href="">2：页面报错，点击不正常，无法使用</a><br>xiongsongsong@beyondsoft.com</div></div>').appendTo($("#footer-container"));
        $("#feedback").on("focus click", "a", function() {
            $("#feedback1")[0].href = "mailto:hangzhenhui@beyondsoft.com?subject=" + encodeURIComponent("页面交互、功能性建议") + "&cc=xiongsongsong@beyondsoft.com&body=url:" + location.href;
            $("#feedback2")[0].href = "mailto:xiongsongsong@beyondsoft.com?subject=" + encodeURIComponent("页面报错，点击不正常，无法使用") + "&cc=hangzhenhui@beyondsoft.com&body=url:" + location.href;
        });
    });
});
