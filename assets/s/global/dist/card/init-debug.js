/**
 * Created by songsong on 12/16/13.
 */
define("sjplus/global/0.0.1/card/init-debug", [ "template-debug", "./card-debug.tpl", "./card-debug.css" ], function(require, exports, module) {
    var template = require("template-debug");
    var compileTpl = template.compile(require("./card-debug.tpl"));
    require("./card-debug.css");
    $('<div id="global-user-card"></div>').appendTo(document.body);
    var $cardNode = $("#global-user-card");
    var cl;
    var popupCl;
    var $window = $(window);
    $(document).on("mouseenter mouseleave", ".J-user-card", function(ev) {
        clearTimeout(cl);
        if (ev.type === "mouseenter") {
            var $target = $(ev.currentTarget);
            var id = $target.data("user-id");
            cl = setTimeout(function() {
                getUserData(id, function(data) {
                    $cardNode.html(template.render(compileTpl, data[id])).fadeIn(100);
                    clearTimeout(popupCl);
                    var y = ev.pageY;
                    if (ev.pageY + $cardNode.height() > $window.height() + $window.scrollTop()) {
                        y = $window.height() + $window.scrollTop() - $cardNode.height() - 10;
                    }
                    var x = ev.pageX;
                    if (ev.pageX + $cardNode.width() > $window.width() + $window.scrollLeft()) {
                        x = $window.width() + $window.scrollLeft() - $cardNode.width() - 10;
                    }
                    //开始判断各种坐标
                    $cardNode.css({
                        left: x,
                        top: y
                    });
                });
            }, 300);
        } else {
            clearTimeout(cl);
            clearTimeout(popupCl);
            popupCl = setTimeout(function() {
                console.log("card hide");
                $cardNode.fadeOut(100);
            }, 1e3);
        }
    });
    $cardNode.on("mouseenter mouseleave", function(ev) {
        if (ev.type === "mouseenter") {
            clearTimeout(popupCl);
        } else {
            popupCl = setTimeout(function() {
                $cardNode.fadeOut(100);
            }, 400);
        }
    });
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

define("sjplus/global/0.0.1/card/card-debug.tpl", [], '<a id="global-user-card-avatar" href="/u/#{_id}" style="background-image:url(/avatar/#{_id}_80x80)"></a>\n    <p class="user">#{user}</p>\n#if(typeof privacy_information!==\'undefined\')\n#run var user=privacy_information\n    <p class="address">#if(user.address)<span class="icon-untitled-3"></span>#{user.address.value}#end</p>\n#if(user.qq || user.zone_url)\n<div id="global-user-card-type">\n    #if(user.qq)\n    <a class="qq icon-untitled-2" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=#{user.qq.value}&site=qq&menu=yes"></a>\n    #end\n    #if(user.zone_url)\n    <a href="#{user.zone_url.value}" class="sina-weibo icon-untitled-28"></a>\n    #end\n</div>\n#end\n#end');

define("sjplus/global/0.0.1/card/card-debug.css", [], function() {
    seajs.importStyle('#global-user-card{width:150px;background:#fff url(http://img.sjplus.cn/read/52ae7698f551edc839000191.png);position:absolute;left:-999px;top:-999px;z-index:99999;box-shadow:0 0 18px rgba(0,0,0,.5);border:solid 1px #aaa}#global-user-card-avatar{width:80px;height:80px;margin:28px auto 0;display:block}#global-user-card p.user{text-align:center;font-size:18px;font-family:"Microsoft Yahei",sans-serif;padding:14px 0 12px}#global-user-card p.address{text-align:center;color:#a1a1a1;margin:0 auto 12px}#global-user-card-type{padding:5px 0;background:#bebfb3;font-size:18px;text-align:center}#global-user-card-type a{margin:0 2px}');
});
