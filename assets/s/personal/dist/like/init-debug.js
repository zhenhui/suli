/**
 * Created by 松松 on 13-10-12.
 */
define("sjplus/personal/0.0.1/like/init-debug", [ "./tab-debug.tpl", "./like-debug.css", "./design/init-debug", "./design/design-debug.tpl", "./design/design-debug.css", "template-debug", "popup-debug" ], function(require, exports, module) {
    var tab = require("./tab-debug.tpl");
    require("./like-debug.css");
    var $container = $("#main-js-container");
    exports.init = function(data, router) {
        //询问是否为当前路由
        if ($container.find("#like").length == 0) {
            $container.html(tab);
        }
        if (!data) return;
        switch (data.view) {
          case "design":
            require("./design/init-debug").init();
            break;

          case "article":
            //require('./article/init').init()
            break;
        }
    };
});

define("sjplus/personal/0.0.1/like/tab-debug.tpl", [], '<div id="like">\n    <div class="container">\n        <div class="tab J-tab">\n            <div class="trigger">\n                <a class="J-tab-trigger" data-behavior="like" href="#view=design&full_redirect=true" tabindex="0">喜欢的作品</a>\n                <!--<a class="J-tab-trigger" data-behavior="like" href="#view=article&full_redirect=true" tabindex="0">喜欢的文章</a>-->\n            </div>\n        </div>\n\n        <div id="tab-container">\n            <h1>容器</h1> <a class="J-tab-trigger" data-behavior="like" href="#view=design&full_redirect=true" tabindex="0">所有作品</a>\n        </div>\n    </div>\n</div>');

define("sjplus/personal/0.0.1/like/like-debug.css", [], function() {
    seajs.importStyle("#like .container{padding:12px}");
});

/**
 * Created by 松松 on 13-10-15.
 */
define("sjplus/personal/0.0.1/like/design/init-debug", [ "template-debug", "popup-debug" ], function(require, exports, module) {
    var tpl = require("sjplus/personal/0.0.1/like/design/design-debug.tpl");
    require("sjplus/personal/0.0.1/like/design/design-debug.css");
    var template = require("template-debug");
    var $container;
    exports.init = function() {
        console.log("设计作品开始加载");
        $container = $("#tab-container");
        $container.innerHTML = "加载中";
        $.getJSON("/design-works/index/like/json/list?r=" + Math.random(), function(data) {
            $container.html(template.render(tpl, {
                data: data
            }));
        });
    };
    var Popup = require("popup-debug");
    var deletePopup = new Popup({
        trigger: ".J-unlike-design-works",
        element: '<div><div class="t">确定取消喜欢？</div><div class="control">' + '<a href="javascript:void(0)"  class="J-unlike-design-works-of-own-trigger" data-action="delete">确定</a>' + '<a href="javascript:void(0)" class="J-cancel">关闭</a>' + "</div></div>",
        id: "unlike-design-works-of-own-trigger",
        delegateNode: "#main-js-container",
        triggerType: "click",
        className: "unlike-design-work",
        effect: "fade",
        align: {
            baseXY: [ -20, -20 ]
        }
    });
    deletePopup.render();
    deletePopup.after("show", function(ev) {
        ev.element.find(".J-unlike-design-works-of-own-trigger").data("id", ev.activeTrigger.attr("data-id"));
    });
    //取消喜欢
    $("#" + deletePopup.get("id")).on("click", ".J-unlike-design-works-of-own-trigger", function(ev) {
        ev.preventDefault();
        var id = $(ev.currentTarget).data("id");
        $.get("/index/unlike", {
            id: $(ev.currentTarget).data("id"),
            type: "design-works"
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

define("sjplus/personal/0.0.1/like/design/design-debug.tpl", [], '<div id="design-container">\n    <div class="list-area">\n        <ul class="list design-works-list clearfix">\n            #if(data.length>0)\n            #each(item,index in data)\n            <li id="J-design-works-#{item._id}">\n                <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>\n                <a href="/design-works/detail/#{item._id}" class="link" target="_blank"></a>\n                <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">\n                <div class="control">\n                    <a class="J-unlike-design-works" data-id="#{item._id}" href="javascript:void(0)">取消喜欢</a>\n                </div>\n            </li>\n            #end\n            #else\n            <li>暂无数据</li>\n            #end\n        </ul>\n    </div>\n</div>');

define("sjplus/personal/0.0.1/like/design/design-debug.css", [], function() {
    seajs.importStyle('#design-container{margin-top:26px}#design-container{overflow:hidden}#design-container .list-area{width:840px}.unlike-design-work{background:#ff3b35;color:#fff;padding:5px 0;text-align:center}.unlike-design-work .t{padding:3px}.unlike-design-work a{color:#fff;margin:0 9px}.design-works-list li{width:230px;height:210px;position:relative;float:left;margin-right:23px;margin-bottom:30px}.design-works-list li div.describe{position:absolute;border-radius:5px;left:0;top:0;width:228px;height:173px;filter:quote("progidDXImageTransform.Microsoft.gradient(enabled=\'true\',startColorstr=\'#CCFFFFFF\', endColorstr=\'#CCFFFFFF\')");background:#fff;visibility:hidden;overflow:hidden;color:#333;text-align:center;border:1px solid #ff8680;background:rgba(255,255,255,.8)}.design-works-list li:hover div.describe{visibility:visible}.design-works-list li a.link{position:absolute;left:0;top:0;width:100%;height:175px;z-index:3;background:url(/read/5281e508e01ac3441b00015d.png)}.design-works-list li img.thumbnails{border-radius:5px;width:230px;height:175px}.design-works-list li:hover div.describe{visibility:visible}.design-works-list li h2{font-size:20px;margin:12px 20px;word-break:break-all}.design-works-list li p{margin:0 20px;word-break:break-all}.design-works-list li .avatar{position:absolute;left:0;top:180px}.design-works-list li .avatar img{border-radius:2px;height:20px;width:20px;opacity:.7;filter:quote("alpha(opacity=70)")}.design-works-list li .avatar img:hover{opacity:1;filter:quote("alpha(opacity=100)")}.design-works-list li .info{position:absolute;right:0;top:184px;color:#999}.design-works-list .info{font-size:12px;font-family:"华文细黑",verdana}.design-works-list .data-icon{font-size:14px;margin-left:3px;margin-right:5px;display:inline-block;vertical-align:middle}.design-works-list li{margin-bottom:1em;margin-right:38px}');
});
