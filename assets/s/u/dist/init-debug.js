/**
 * Created by 松松 on 13-11-12.
 */
define("sjplus/u/0.0.1/init-debug", [ "./user-panel-debug", "./user-panel-debug.tpl", "template-debug" ], function(require, exports, module) {
    //加载用户面板
    require("./user-panel-debug");
    KISSY.use("event", function(S, Event) {
        function hashChange() {
            $("#J-navigation-trigger a").removeClass("active");
            var hash = location.hash.substring(1);
            switch (location.hash) {
              case "#design-works":
                require.async("sjplus/u/0.0.1/design-works", function(obj) {
                    obj.init();
                    $("#J-navigation-trigger a." + hash).addClass("active");
                });
                break;

              case "#article":
                require.async("sjplus/u/0.0.1/article", function(obj) {
                    obj.init();
                    $("#J-navigation-trigger a." + hash).addClass("active");
                });
                break;

              default:
                if (location.hash !== "#design-works" && location.hash !== "#article") {
                    require.async("sjplus/u/0.0.1/design-works", function(obj) {
                        obj.init();
                        $("#J-navigation-trigger a.design-works").addClass("active");
                    });
                }
                break;
            }
        }
        Event.on(window, "hashchange", hashChange);
        hashChange();
    });
});

/**
 * Created by 松松 on 13-11-12.
 */
define("sjplus/u/0.0.1/user-panel-debug", [ "template-debug" ], function(require, exports, module) {
    var tpl = require("sjplus/u/0.0.1/user-panel-debug.tpl");
    var template = require("template-debug");
    var idMatch = location.href.match(/\/u\/([0-9a-z]{24})/g);
    var id = RegExp.$1;
    if (idMatch) {
        $.ajax({
            url: "/u/json/user-info",
            data: {
                id_arr: id
            },
            dataType: "jsonp"
        }).done(function(data) {
            if (data[id]) {
                $("#user-panel").html(template.render(tpl, data[id]));
            }
        });
    }
});

define("sjplus/u/0.0.1/user-panel-debug.tpl", [], '<a href="/u/#{_id}" class="avatar">\n    <img src="/avatar/#{_id}_80x80">\n</a>\n<div class="info">\n    <h2>#{user}</h2>\n    #if(typeof privacy_information!==\'undefined\')\n    #run var privacy = privacy_information\n    #if(typeof privacy.address!==\'undefined\')<p class="address">#{privacy.address.value}</p>#end\n    #if(typeof privacy.job!==\'undefined\')<p class="job">#{privacy.job.value}</p>#end\n    #end\n</div>\n<div class="count" id="J-navigation-trigger">\n    <a class="design-works" href="#design-works">\n        <span class="num">#if(index["design-works"])#{index["design-works"]}#else0#end</span>\n        <span class="title">作品</span>\n        <s></s>\n    </a>\n    <a class="article" href="#article">\n        <span class="num">#if(index["article"])#{index["article"]}#else0#end</span>\n        <span class="title">文章</span>\n        <s></s>\n    </a>\n</div>');
