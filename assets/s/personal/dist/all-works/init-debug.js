/**
 * Created by 松松 on 13-10-12.
 */
define("sjplus/personal/0.0.1/all-works/init-debug", [ "./tab-debug.tpl", "./all-works-debug.css", "./design/init-debug", "./design/design-debug.tpl", "./design/design-debug.css", "template-debug", "popup-debug", "./article/init-debug", "./article/article-debug.tpl", "./article/article-debug.css" ], function(require, exports, module) {
    var tab = require("./tab-debug.tpl");
    require("./all-works-debug.css");
    var $container = $("#main-js-container");
    exports.init = function(data, router) {
        //询问是否为当前路由
        if ($container.find("#all-works").length == 0) {
            $container.html(tab);
        }
        if (!data) return;
        switch (data.view) {
          case "design":
            console.log("进入设计视图");
            require("./design/init-debug").init();
            break;

          case "article":
            console.log("进入文章视图");
            require("./article/init-debug").init();
            break;
        }
    };
});

define("sjplus/personal/0.0.1/all-works/tab-debug.tpl", [], '<div id="all-works">\n    <div class="container">\n        <div class="tab J-tab">\n            <div class="trigger">\n                <a class="J-tab-trigger" data-behavior="all-works" href="#view=design&full_redirect=true" tabindex="0">所有作品</a>\n                <a class="J-tab-trigger" data-behavior="all-works" href="#view=article&full_redirect=true" tabindex="0">所有文章</a>\n            </div>\n        </div>\n\n        <div id="tab-container">\n            <h1></h1> <a class="J-tab-trigger" data-behavior="all-works" href="#view=design&full_redirect=true" tabindex="0"></a>\n        </div>\n    </div>\n</div>');

define("sjplus/personal/0.0.1/all-works/all-works-debug.css", [], function() {
    seajs.importStyle("#all-works .container{padding:12px}");
});

/**
 * Created by 松松 on 13-10-15.
 */
define("sjplus/personal/0.0.1/all-works/design/init-debug", [ "template-debug", "popup-debug" ], function(require, exports, module) {
    var tpl = require("sjplus/personal/0.0.1/all-works/design/design-debug.tpl");
    require("sjplus/personal/0.0.1/all-works/design/design-debug.css");
    var template = require("template-debug");
    var $container;
    exports.init = function() {
        console.log("设计作品开始加载");
        $container = $("#tab-container");
        $container.innerHTML = "加载中";
        $.getJSON("/design-works/own/list?r=" + Math.random(), function(data) {
            $container.html(template.render(tpl, data));
        });
    };
    var Popup = require("popup-debug");
    var deletePopup = new Popup({
        trigger: ".J-delete-design-works",
        element: '<div><div class="t">确定删除？</div><div class="control">' + '<a href="javascript:void(0)"  class="J-delete-design-works-of-own-trigger" data-action="delete">删除</a>' + '<a href="javascript:void(0)" class="J-cancel">取消</a>' + "</div></div>",
        id: "delete-design-works-of-own-trigger",
        delegateNode: "#main-js-container",
        triggerType: "click",
        className: "delete-design-work",
        effect: "fade",
        align: {
            baseXY: [ -20, -20 ]
        }
    });
    deletePopup.render();
    deletePopup.after("show", function(ev) {
        ev.element.find(".J-delete-design-works-of-own-trigger").data("id", ev.activeTrigger.attr("data-id"));
    });
    //删除个人作品
    $("#" + deletePopup.get("id")).on("click", ".J-delete-design-works-of-own-trigger", function(ev) {
        ev.preventDefault();
        var id = $(ev.currentTarget).data("id");
        $.get("/design-works/delete", {
            id: $(ev.currentTarget).data("id")
        }, function(data) {
            var $li = $("#J-design-works-" + id);
            $li.fadeOut(function() {
                $li.remove();
            });
            deletePopup.hide();
        });
    });
    $("#" + deletePopup.get("id")).on("click", ".J-cancel", function() {
        deletePopup.hide();
    });
});

define("sjplus/personal/0.0.1/all-works/design/design-debug.tpl", [], '<div id="design-container">\n    <div class="list-area">\n        <ul class="list design-works-list clearfix">\n            #if(docs.length>0)\n            #each(item,index in docs)\n            <li id="J-design-works-#{item._id}">\n                <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>\n                <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">\n                <a href="#{hostDOMAIN}/design-works/detail/#{item._id}" class="link" target="_blank"></a>\n                <div class="control">\n                    <a class="J-delete-design-works" data-id="#{item._id}" href="javascript:void(0)">删除</a>\n                </div>\n            </li>\n            #end\n            #else\n            <li>暂无数据</li>\n            #end\n        </ul>\n    </div>\n</div>');

define("sjplus/personal/0.0.1/all-works/design/design-debug.css", [], function() {
    seajs.importStyle('#design-container{margin-top:26px}#design-container{overflow:hidden}#design-container .list-area{width:840px}.delete-design-work{background:#ff3b35;color:#fff;padding:5px 0;text-align:center}.delete-design-work .t{padding:3px}.delete-design-work a{color:#fff;margin:0 9px}.design-works-list li{width:230px;height:210px;position:relative;float:left;margin-right:23px;margin-bottom:30px}.design-works-list li div.describe{position:absolute;border-radius:5px;left:0;top:0;width:228px;height:173px;filter:quote("progidDXImageTransform.Microsoft.gradient(enabled=\'true\',startColorstr=\'#CCFFFFFF\', endColorstr=\'#CCFFFFFF\')");background:#fff;visibility:hidden;overflow:hidden;color:#333;text-align:center;border:1px solid #ff8680;background:rgba(255,255,255,.8)}.design-works-list li:hover div.describe{visibility:visible}.design-works-list li a.link{position:absolute;left:0;top:0;width:100%;height:175px;z-index:3;background:url(/read/5281e508e01ac3441b00015d.png)}.design-works-list li img.thumbnails{border-radius:5px;width:230px;height:175px}.design-works-list li:hover div.describe{visibility:visible}.design-works-list li h2{font-size:20px;margin:12px 20px;word-break:break-all}.design-works-list li p{margin:0 20px;word-break:break-all}.design-works-list li .avatar{position:absolute;left:0;top:180px}.design-works-list li .avatar img{border-radius:2px;height:20px;width:20px;opacity:.7;filter:quote("alpha(opacity=70)")}.design-works-list li .avatar img:hover{opacity:1;filter:quote("alpha(opacity=100)")}.design-works-list li .info{position:absolute;right:0;top:184px;color:#999}.design-works-list .info{font-size:12px;font-family:"华文细黑",verdana}.design-works-list .data-icon{font-size:14px;margin-left:3px;margin-right:5px;display:inline-block;vertical-align:middle}.design-works-list li{margin-bottom:1em;margin-right:38px}');
});

/**
 * Created by 松松 on 13-10-15.
 */
define("sjplus/personal/0.0.1/all-works/article/init-debug", [ "template-debug" ], function(require, exports, module) {
    var template = require("template-debug");
    var tpl = require("sjplus/personal/0.0.1/all-works/article/article-debug.tpl");
    require("sjplus/personal/0.0.1/all-works/article/article-debug.css");
    var $container;
    exports.init = function() {
        console.log("当前处于文章视图中" + module.id);
        $container = $("#tab-container");
        $container.html("加载中...");
        $.getJSON("/personal/article/list?r=" + Math.random(), function(data) {
            $container.html(template.render(tpl, data));
        });
    };
});

define("sjplus/personal/0.0.1/all-works/article/article-debug.tpl", [], '<div id="article-container">\n    #if(typeof docs!==\'undefined\')\n    #each(item,index in docs)\n    #run var date=new Date(item.ts)\n    <div class="article">\n        <h2>#{item.title}<span class="tag">【#{item.tag.join(\',\')}】</span><span class="date">#{date.getFullYear()}年#{date.getMonth()+1}月</span></h2>\n\n        <p class="banner"><img width="770" height="200" src="#{imgCDN}/read/#{item.thumbnails_id.split(\':\')[0]}"></p>\n\n        <div class="content">#{item.content}...</div>\n    </div>\n    #end\n    #end\n</div>');

define("sjplus/personal/0.0.1/all-works/article/article-debug.css", [], function() {
    seajs.importStyle("#article-container{margin:18px 0 0}#article-container h2{font-size:20px;margin-bottom:6px}#article-container h2 span.tag{margin-left:12px;font-size:12px}#article-container h2 span.date{margin-left:12px;font-size:12px}#article-container div.content{line-height:23px;font-family:simsun,sans-serif;color:#666}#article-container div.article{margin-bottom:35px}");
});
