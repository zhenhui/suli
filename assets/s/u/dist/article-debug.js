/**
 * Created by 松松 on 13-11-12.
 */
define("sjplus/u/0.0.1/article-debug", [ "template-debug", "./article-debug.tpl" ], function(require, exports, module) {
    var template = require("template-debug");
    var tpl = require("./article-debug.tpl");
    var idMatch = location.href.match(/\/u\/([0-9a-z]{24})/g);
    var id = RegExp.$1;
    exports.init = function() {
        if (idMatch) {
            $.ajax({
                url: "/user/article/json",
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

define("sjplus/u/0.0.1/article-debug.tpl", [], '<div id="article-container">\n    #each(item in data)\n    <div class="article"><h2><a href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_30x30" class="avatar"></a><span\n            class="title"><a href="/article/#{item.title}">#{item.title}</a></span><span class="tag">【#{item.tag.join(\' \')}】</span><span\n            class="date">todo</span>\n    </h2>\n\n        <p class="banner"><a href="/article/#{item.title}"><img width="770" height="200"\n                                                                src="#{imgCDN}/read/#{item.thumbnails_id}"></a>\n        </p>\n\n        <div class="content">#{item.content}</div>\n    </div>\n    #end\n</div>');
