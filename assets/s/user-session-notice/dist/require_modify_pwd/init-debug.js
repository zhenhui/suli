/**
 * Created by xiongsongsong on 12/6/13.
 */
define("sjplus/user-session-notice/0.0.1/require_modify_pwd/init-debug", [ "./init-debug.tpl", "./tpl-debug.css" ], function(require, exports, module) {
    var tpl = require("./init-debug.tpl");
    require("./tpl-debug.css");
    var div = document.getElementsByTagName("div")[0];
    $(div).before($(tpl));
});

define("sjplus/user-session-notice/0.0.1/require_modify_pwd/init-debug.tpl", [], '<p id="require-modify-pwd-tips-container">\n <a href=\'/personal#account-setting{"highlight":"#modify-pwd"}\'>您还没有修改过默认密码，请及时点击此处进行修改。</a>\n</p>');

define("sjplus/user-session-notice/0.0.1/require_modify_pwd/tpl-debug.css", [], function() {
    seajs.importStyle("#require-modify-pwd-tips-container{background:#ff3b35;text-align:center;padding:16px 0;font-weight:700;font-size:14px}#require-modify-pwd-tips-container,#require-modify-pwd-tips-container a{color:#fff;text-decoration:underline}");
});
