/**
 * Created by songsong on 12/16/13.
 */
define("sjplus/global/0.0.1/card/init-debug", [ "position-debug", "template-debug", "./card-debug.tpl", "./card-debug.css" ], function(require, exports, module) {
    var S = KISSY;
    var position = require("position-debug");
    var template = require("template-debug");
    var compileTpl = template.compile(require("./card-debug.tpl"));
    require("./card-debug.css");
    $('<div id="global-user-card"></div>').appendTo(document.body);
    var $cardNode = $("#global-user-card");
    var cl;
    $(document).on("mouseenter mouseleave", ".J-user-card", function(ev) {
        clearTimeout(cl);
        if (ev.type === "mouseenter") {
            var $target = $(ev.currentTarget);
            cl = setTimeout(function() {
                init($target, $target.data("user-id"));
            }, 300);
        } else {
            clearTimeout(cl);
        }
    });
    var $window = $(window);
    function init(target, id) {
        getUserData(id, function(data) {
            $cardNode.html(template.render(compileTpl, data[id]));
            //开始判断各种坐标
            var offset = target.offset();
            //判断是应该在左边和右边显示
            var x;
            if (offset.left - $window.scrollLeft() - $cardNode.width() / 2 < 0) {
                x = target.width() / 2;
                console.log("超出左边界");
            } else {
                //检测是否超出了右边界
                if (offset.left + $cardNode.width() > $window.width() + $window.scrollLeft()) {
                    console.log("超出右边界");
                    x = "100%";
                } else {
                    console.log("剧中显示");
                    x = "50%";
                }
            }
            //优先在上方显示
            if (offset.top - $cardNode.height() > $window.scrollTop()) {
                position.pin({
                    element: $cardNode,
                    x: x,
                    y: "100%"
                }, {
                    element: target,
                    x: target.width() / 2,
                    y: "0"
                });
            } else {
                position.pin({
                    element: $cardNode,
                    x: x,
                    y: "0"
                }, {
                    element: target,
                    x: target.width() / 2,
                    y: "100%"
                });
            }
        });
    }
    function getUserData(id, cb) {
        $.ajax({
            url: "/u/json/user-info",
            data: {
                id_arr: id
            },
            dataType: "jsonp"
        }).done(function(data) {
            if (data[id]) {
                if (cb) cb(data);
            }
        });
    }
});

define("sjplus/global/0.0.1/card/card-debug.tpl", [], '<a id="global-user-card-avatar" style="background-image:url(/avatar/#{_id}_80x80)"></a>\n    <p class="user">#{user}</p>\n#if(typeof privacy_information!==\'undefined\')\n#run var user=privacy_information\n    <p class="address">#if(user.address)<span class="icon-untitled-3"></span>#{user.address.value}#end</p>\n#if(user.qq || user.zone_url)\n<div id="global-user-card-type">\n    #if(user.qq)\n    <a class="qq icon-untitled-2" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=#{user.qq.value}&site=qq&menu=yes"></a>\n    #end\n    #if(user.zone_url)\n    <a href="#{user.zone_url.value}" class="sina-weibo icon-untitled-28"></a>\n    #end\n</div>\n#end\n#end');

define("sjplus/global/0.0.1/card/card-debug.css", [], function() {
    seajs.importStyle('#global-user-card{width:150px;background:#fff url(http://img.sjplus.cn/read/52ae7698f551edc839000191.png);position:absolute;left:-999px;top:-999px;z-index:99999;box-shadow:0 0 12px rgba(0,0,0,.5)}#global-user-card-avatar{width:80px;height:80px;margin:28px auto 0;display:block}#global-user-card p.user{text-align:center;font-size:18px;font-family:"Microsoft Yahei",sans-serif;padding:14px 0 12px}#global-user-card p.address{text-align:center;color:#a1a1a1;margin:0 auto 12px}#global-user-card-type{padding:5px 0;background:#bebfb3;font-size:18px;text-align:center}#global-user-card-type a{margin:0 2px}');
});
