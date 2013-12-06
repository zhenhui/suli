/**
 * Created by 松松 on 13-12-2.
 */
define("sjplus/design-works/0.0.1/tag/tag-debug", [ "/go/design-works/tag?callback=define-debug", "./tag-debug.tpl", "template-debug" ], function(require, module, exports) {
    KISSY.use("dom,event,json,io", function(S, DOM, Event) {
        //加载标签
        var tag = S.map(require("/go/design-works/tag?callback=define-debug").replace(/\s/gm, "").split(/[,，]/gim), function(tag) {
            return '<a href="#" data-text="' + tag + '" class="tag">' + '<span class="J-tag">' + tag + "" + '</span><span class="close J-close">&times;</span></a> ';
        });
        var $tag = $("#J-tag-control-container");
        var $category = $("#J-category-container");
        $tag.html(tag.join(""));
        //加载类目
        require.async("/design-works/json/category?callback=define", function(category) {
            var str = S.map(S.keys(category), function(key) {
                return '<a href="#" data-text="' + key + '" class="tag J-category">' + '<span class="J-text">' + key + "</span>" + '(<span class="J-count">' + category[key] + '</span>)<span class="close J-close">&times;</span>' + "</a>";
            });
            $category.html(str);
        });
        var $more = $(".J-show-more");
        var tpl = require("./tag-debug.tpl");
        var template = require("template-debug");
        var page = 1;
        var pageNum = 1;
        var count = 36;
        var sumPage = 0;
        var $list = $("#J-design-works-list");
        var xhr;
        function getData() {
            if (xhr && xhr.readyState != 4) {
                xhr.abort();
            }
            var config = updateHash();
            $more.addClass("loading btn-disabled").html("&nbsp;");
            xhr = $.ajax({
                url: "/design-works/filter/json",
                dataType: "jsonp",
                data: {
                    tag: config.tag,
                    category: config.category,
                    page: page,
                    pageNum: pageNum,
                    count: count
                }
            }).done(function(data) {
                sumPage = data.sumPage;
                $more.removeClass("loading");
                if (page === data.sumPage || data.sumPage === 0) {
                    $more.html("没有更多了").addClass("btn-disabled");
                } else {
                    $more.html("加载更多").removeClass("btn-disabled");
                }
                $(template.render(tpl, data)).appendTo($list);
                $list.removeClass("loading");
            });
        }
        //显示更多
        $more.on("click", function(ev) {
            ev.preventDefault();
            if ($(this).hasClass("loading")) return;
            if (page < sumPage) {
                page++;
                getData();
            } else {
                $(this).html("没有更多了").addClass("btn-disabled");
            }
        });
        //控制tag
        $tag.on("click", "a.tag", function(ev) {
            ev.preventDefault();
            var $target = $(ev.currentTarget);
            $target.toggleClass("active");
            $list.addClass("loading").html("");
            updateHash();
        });
        //控制category
        $category.on("click", ".J-category", function(ev) {
            ev.preventDefault();
            var $target = $(ev.currentTarget);
            $target.toggleClass("active").siblings(".J-category").removeClass("active");
            $list.addClass("loading").html("");
            updateHash();
        });
        //更新hash
        function updateHash() {
            var tag = [];
            $tag.find("a.active").each(function(index, item) {
                tag.push($(item).find(".J-tag").text());
            });
            var category = [];
            $category.find("a.active").each(function(index, item) {
                category.push($(item).find(".J-text").text());
            });
            var config = {
                tag: tag.join(","),
                category: category.join(",")
            };
            if (config.tag.length < 1) delete config.tag;
            if (config.category.length < 1) delete config.category;
            if (config.tag || config.category) {
                window.location.hash = "#" + JSON.stringify(config);
            } else {
                window.location.hash = "";
            }
            return config;
        }
        //将URL上的hash变化，反映到标签和类目的状态上
        //在页面初始化执行
        function translateHash() {
            //8是一个随便设定的值得，检测是否有必要try catch
            if (location.hash.length > 8) {
                try {
                    var config = JSON.parse(location.hash.substring(1));
                } catch (e) {
                    console.log("没有发现配置");
                }
            }
            if (!config) return;
            if (config.tag) {
                S.each(config.tag.split(","), function(text) {
                    $tag.find('[data-text="' + text + '"]').addClass("active");
                });
            }
            if (config.category) {
                S.each(config.category.split(","), function(text) {
                    $category.find('[data-text="' + text + '"]').addClass("active");
                });
            }
        }
        translateHash();
        Event.on(window, "hashchange", getData);
        Event.fire(window, "hashchange", getData);
        //右侧类目漂浮
        var $sidebar = $("#sidebar-wrapper");
        var $container = $("#tag-design-works-wrapper");
        function fixedSidebar() {
            if (DOM.scrollTop() > $container.offset().top) {
                $sidebar.addClass("fixed");
            } else {
                $sidebar.removeClass("fixed");
            }
        }
        Event.on(window, "scroll", fixedSidebar);
        Event.fire(window, "scroll", fixedSidebar);
    });
});

define("sjplus/design-works/0.0.1/tag/tag-debug.tpl", [], '#each(item in data)\n<li>\n    <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>\n    <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">\n    <a href="#{hostDOMAIN}/design-works/detail/#{item._id}" target="_blank" class="link"></a>\n    <div class="avatar">\n        <a href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_20x20"></a>\n    </div>\n    <div class="info">\n        <span class="view"> <b class="data-icon" data-icon="&#xe00a;"></b> #{item.index.view} </span>\n        <span class="like"> <b class="data-icon" data-icon="&#xe007;"></b> #{item.index.like} </span>\n        <span class="comment"> <b class="data-icon" data-icon="&#xe015;"></b> #{item.index.comment} </span>\n    </div>\n</li>\n#end');
