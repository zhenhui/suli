/**
 * Created by 松松 on 13-11-12.
 */
define("sjplus/design-works/0.0.1/home/home-debug", [ "./tpl-debug.tpl", "template-debug" ], function(require, exports, module) {
    var tpl = require("./tpl-debug.tpl");
    var template = require("template-debug");
    var page = 1;
    var pageNum = 1;
    var count = 36;
    var sumPage = 0;
    function getData() {
        $.ajax({
            url: hostDOMAIN + "/design-works/latest/list",
            dataType: "jsonp",
            data: {
                page: page,
                pageNum: pageNum,
                count: count
            }
        }).done(function(data) {
            sumPage = data.sumPage;
            if (page === data.sumPage) {
                $(".J-show-more").html("没有更多了");
            }
            $(template.render(tpl, data)).appendTo($("#J-design-works-list"));
        });
    }
    getData();
    //显示更多
    $(".J-show-more").on("click", function(ev) {
        ev.preventDefault();
        if (page < sumPage) {
            page++;
            getData();
        } else {
            $(this).html("没有更多了");
        }
    });
});

define("sjplus/design-works/0.0.1/home/tpl-debug.tpl", [], '#each(item in data)\n<li>\n    <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>\n    <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">\n    <a href="#{hostDOMAIN}/design-works/detail/#{item._id}" class="link"></a>\n    <div class="avatar J-user-card" data-user-id="#{item.owner_id}">\n        <a href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_20x20"></a>\n    </div>\n    <div class="info">\n        <span class="view"> <b class="data-icon" data-icon="&#xe00a;"></b> #{item.index.view} </span>\n        <span class="like"> <b class="data-icon" data-icon="&#xe007;"></b> #{item.index.like} </span>\n        <span class="comment"> <b class="data-icon" data-icon="&#xe015;"></b> #{item.index.comment} </span>\n    </div>\n</li>\n#end');
