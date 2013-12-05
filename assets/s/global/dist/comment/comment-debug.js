/**
 * Created by 松松 on 13-11-26.
 */
define("sjplus/global/0.0.1/comment/comment-debug", [ "template-debug", "sjplus/global/0.0.1/login/login-debug", "./comment-block-debug.tpl", "./comment-debug.css", "./comment-textarea-debug.tpl" ], function(require, exports, module) {
    var template = require("template-debug");
    var login = require("sjplus/global/0.0.1/login/login-debug");
    var $wrapper = $("#J-comment-wrapper");
    //非常重要：留言所属的ID
    var id = $wrapper.attr("data-page-id");
    //非常重要：留言所属的类型，比如针对作品，还是针对文章的
    //目前仅仅支持两种类型
    var type = $wrapper.attr("data-type");
    var $h2;
    var $window = $(window);
    var tpl = require("./comment-block-debug.tpl");
    var cache = template.compile(tpl);
    $window.on("scroll", scrollCheck);
    function scrollCheck() {
        if ($window.scrollTop() + $window.height() > $wrapper.offset().top) {
            $window.off("scroll", scrollCheck);
            init();
        }
    }
    scrollCheck();
    function init() {
        require("./comment-debug.css");
        initWaterfall();
        $("#J-comment-wrapper").html(require("./comment-textarea-debug.tpl"));
        $h2 = $wrapper.find("h2");
    }
    function initWaterfall() {
        KISSY.use("gallery/waterfall/1.0/,node,ajax,dom,event", function(S, Waterfall, Node, IO) {
            var $ = Node.all;
            var nextPage = 1;
            var first = true;
            exports.waterfall = new Waterfall.Loader({
                container: "#comment-container",
                // 窗口大小变化时的调整特效
                load: function(success, end) {
                    IO({
                        data: {
                            id: id,
                            page: nextPage,
                            per_page: 10
                        },
                        url: "/comment/list",
                        dataType: "jsonp",
                        success: function(data) {
                            if (first && data.total_count > 0) {
                                $h2.html(data.total_count > 0 ? '<span class="J-count">' + data.total_count + "</span>条评论" : "暂无评论");
                                first = false;
                            }
                            // 如果数据错误, 则立即结束
                            if (data["status"] !== "ok") {
                                end();
                                if (first) {
                                    $h2.html('<span class="J-count">0</span>条评论');
                                    first = false;
                                }
                                return;
                            }
                            // 拼装每页数据
                            var items = [];
                            S.each(data.docs, function(item) {
                                items.push(new S.Node(template.render(cache, item)));
                            });
                            // 如果到最后一页了, 也结束加载
                            nextPage = data.page + 1;
                            if (nextPage > data.total_page) {
                                end();
                            }
                            success(items);
                        },
                        complete: function() {}
                    });
                },
                minColCount: 2,
                colWidth: 390
            });
        });
    }
    var $body = $(document.body);
    //发送留言
    $body.on("click", ".J-send-new-comment-trigger", function(ev) {
        var $this = $(this);
        var $parent = $this.parents(".J-new-comment");
        var $textarea = $parent.find("textarea");
        var val = $textarea.val();
        $.post("/comment/new", {
            content: val,
            _csrf: window._csrf_token_,
            _id: id,
            type: type
        }, function(data) {
            if (data.docs) {
                $(template.render(cache, data.docs)).insertAfter($("#comment-container>div.ks-waterfall").eq(0));
                exports.waterfall.adjust();
                var count = parseInt($h2.find("span.J-count").html(), 10);
                $h2.find("span.J-count").html(count + 1);
                $textarea.val("");
                $(".J-comment").find(".J-count").html(count + 1);
            } else {
                if (data.status == -1) {
                    login.login();
                } else {
                    alert("遇到错误：\r\n" + data.err.join("\r\n"));
                }
            }
        });
    });
    //回复的锚点
    $body.on("click", ".J-comment-trigger", function() {
        $("#J-comment-textarea").focus();
    });
});

define("sjplus/global/0.0.1/comment/comment-block-debug.tpl", [], '<div class="item-container J-comment-item ks-waterfall" data-owner-id="#{owner_id}">\n    <div class="container">\n        <div class="user-info">\n            <div class="user"><a class="avatar" href="/u/#{owner_id}"><img src="#{imgCDN}/avatar/#{owner_id}_20x20"></a><span\n                    class="user-name">#if(typeof owner_user===\'string\')#{owner_user}#end</span></div>\n            <div class="date">\n                #run var date=new Date(ts)\n                #{date.getFullYear()}.#{date.getMonth()+1}.#{date.getDate()}-#{date.getHours()}:#{date.getMinutes()}:#{date.getSeconds()}\n            </div>\n        </div>\n        <div class="content J-comment-area">#{content}<div class="J-reply-trigger reply-trigger">\n            <a href="#" class="J-reply">回复</a></div>\n        </div>\n    </div>\n</div>\n');

define("sjplus/global/0.0.1/comment/comment-debug.css", [], function() {
    seajs.importStyle(".comment-container{position:relative}.J-comment-container{width:790px;overflow:hidden;margin-top:23px}.J-comment-container h2{font-size:14px;margin-bottom:12px}.comment-container .ks-waterfall-col-0{left:0!important}.comment-container .ks-waterfall-col-1{margin-left:5px}.comment-container .item-container{width:390px;overflow:hidden;position:absolute}.comment-container .item-container .user-info{padding:11px 13px}.comment-container .container{position:relative;background:#fff;padding-bottom:13px;margin-bottom:10px}.comment-container .container .content{margin:0 13px;white-space:pre}.comment-container .container .reply-trigger{text-align:right;padding:12px 0;display:none}.comment-container .container .reply a{color:#999}.comment-container a.avatar{display:inline-block;vertical-align:middle;margin-right:5px}.comment-container a.avatar img{width:20px;height:20px;display:inline-block;vertical-align:middle;border-radius:2px}.comment-container span.user-name{margin-left:5px;color:#999}.comment-container .container .date{position:absolute;right:13px;top:11px;color:#999}.comment-container .container ul{margin:0 13px}.comment-container .container ul li{line-height:normal;padding:5px 0}.J-reply-container{text-align:right;margin:12px 0}.J-reply-container textarea{width:352px;height:46px;background:#bebfb3;border:0;padding:10px 0 0 10px;color:#333;resize:none}.new-comment{margin-bottom:10px;background:#fff;padding-bottom:10px}.new-comment textarea{margin:10px 0 0 10px;width:365px;border:0;resize:none;background:#bebfb3;border:0;padding:10px 0 0 10px;height:63px;overflow:auto}.new-comment .btn{margin-right:5px;margin-top:5px}.J-send-new-comment{text-align:right}");
});

define("sjplus/global/0.0.1/comment/comment-textarea-debug.tpl", [], '<div id="J-comment-container" data-id="#{page-id}" class="J-comment-container"><h2>正在加载评论...</h2>\n    <div id="comment-container" class="comment-container">\n        <div class="item-container new-comment J-new-comment ks-waterfall">\n            <textarea id="J-comment-textarea" data-id="#{page-id}"></textarea>\n            <div class="J-send-new-comment">\n                <button class="J-send-new-comment-trigger btn btn-normal">发送</button>\n            </div>\n        </div>\n    </div>\n</div>\n');
