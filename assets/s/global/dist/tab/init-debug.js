/**
 * Created by 松松 on 13-10-14.
 */
define("sjplus/global/0.0.1/tab/init-debug", [], function(require, exports, module) {
    $(document).on("click", ".J-tab-trigger", function() {
        var $this = $(this);
        $this.addClass("active").siblings(".J-tab-trigger").removeClass("active");
    });
});
