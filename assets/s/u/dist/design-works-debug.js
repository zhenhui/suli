/**
 * Created by 松松 on 13-11-12.
 */
define("sjplus/u/0.0.1/design-works-debug", [ "./design-works-debug.tpl", "template-debug" ], function(require, exports, module) {
    var tpl = require("./design-works-debug.tpl");
    var template = require("template-debug");
    var idMatch = location.href.match(/\/u\/([0-9a-z]{24})/g);
    var id = RegExp.$1;
    exports.init = function() {
        if (idMatch) {
            $.ajax({
                url: "/user/design-works/json",
                data: {
                    _id: id
                },
                dataType: "jsonp"
            }).done(function(data) {
                $("#main-container-wrapper").html(template.render(tpl, {
                    data: data
                }));
            });
        }
    };
});

define("sjplus/u/0.0.1/design-works-debug.tpl", [], '<div id="design-works-container">\n    <ul class="clearfix design-works-list">\n        #each(item in data)\n        <li>\n            <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>\n            <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">\n            <a href="#{hostDOMAIN}/design-works/detail/#{item._id}" class="link"></a>\n            <div class="avatar">\n                <a href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_20x20"></a>\n            </div>\n            <div class="info">\n                <span class="view"> <b class="data-icon" data-icon="&#xe00a;"></b> #{item.index.view} </span>\n                <span class="like"> <b class="data-icon" data-icon="&#xe007;"></b> #{item.index.like} </span>\n                <span class="comment"> <b class="data-icon" data-icon="&#xe015;"></b> #{item.index.comment} </span>\n            </div>\n        </li>\n        #end\n    </ul>\n</div>');
