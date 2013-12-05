/**
 * Created by 松松 on 13-11-10.
 */
define("sjplus/article/0.0.1/list/init-debug", [ "./category-debug", "template-debug", "./category-debug.tpl" ], function(require, exports, module) {
    var category = require("./category-debug");
    var template = require("template-debug");
    var tpl = require("./category-debug.tpl");
    alert(tpl);
    alert(123);
    var $categoryContainer = $("#category-container");
    //加载侧边分类
    category.getCategoryResult(function(result) {
        $("#category-container").html(template.render(tpl, {
            data: result
        }));
        var category = KISSY.unparam(location.search.substring(1));
        KISSY.each(KISSY.keys(category), function(item) {
            $categoryContainer.find('[data-category="' + category[item] + '"]').addClass("active");
        });
    });
});

/**
 * Created by 松松 on 13-11-10.
 */
define("sjplus/article/0.0.1/list/category-debug", [], function(require, exports, module) {
    exports.getCategoryResult = function(callback) {
        $.ajax({
            url: "/article/json/category",
            dataType: "jsonp"
        }).done(function(data) {
            callback(data);
        });
    };
});

define("sjplus/article/0.0.1/list/category-debug.tpl", [], '<ul>\n    #js\n    for(var k in data){\n    #end\n    <li><a href="?category=#{k}" class="J-category" data-category="#{k}">#{k}<span class="count">（#{data[k]}）</span></a></li>\n    #js\n    }\n    #end\n</ul>');
