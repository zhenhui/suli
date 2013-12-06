/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/personal/0.0.1/design-works/init-debug", [ "template-debug", "./manage-debug.tpl", "./manage-debug.css" ], function(require, exports, module) {
    var template = require("template-debug");
    var tpl = require("./manage-debug.tpl");
    require("./manage-debug.css");
    var $container = $("#main-js-container");
    exports.init = function() {
        $.getJSON("/design-works/share/list?r=" + Math.random(), function(data) {
            $container.html(template.render(tpl, data));
        });
    };
});

define("sjplus/personal/0.0.1/design-works/manage-debug.tpl", [], '<div id="manage-design-works">\n    <div class="container"><h3>管理共享文件</h3>\n\n        <div class="list-area">\n            <ul class="list clearfix">\n                #if(typeof docs!==\'undefined\')\n                #each(item,index in docs)\n                <li><a href="/design-works/detail/#{item._id}"><img\n                        src="#{imgCDN}/read/#{item.thumbnails_id.split(\':\')[0]}" alt="#{item.content.replace(/[\r\n]/gmi,\'\')}"\n                        width="230" height="175"\n                        class="avatar"></a>\n\n                    <div class="user"><a class="avatar" href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_20x20"></a><span class="info">#{item.title}</span></div>\n                </li>\n                #end\n                #else\n                <li>暂无数据</li>\n                #end\n            </ul>\n        </div>\n    </div>\n</div>');

define("sjplus/personal/0.0.1/design-works/manage-debug.css", [], function() {
    seajs.importStyle("#manage-design-works .list{width:900px}#manage-design-works .list li{width:233px;float:left;height:230px;margin-right:38px}#manage-design-works .list li .user{font-size:12px}#manage-design-works .list li .user a.avatar{display:inline-block;width:20px;height:20px;vertical-align:middle;margin-right:4px}#manage-design-works .list li .user span.info{display:inline-block;vertical-align:middle}");
});
