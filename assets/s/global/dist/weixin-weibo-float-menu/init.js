define("sjplus/global/0.0.1/weixin-weibo-float-menu/init",["./menu.css","./menu.tpl"],function(a){a("./menu.css");var b=a("./menu.tpl"),c=document.createElement("div");c.id="weixin-weibo-float-menu-wrapper",c.innerHTML=b,document.body.appendChild(c);var d=$("#weixin-weibo-float-menu-wrapper");d.on("click",".J-top",function(){$("body,html").animate({scrollTop:0},300,"swing",function(){})}),d.on("mouseenter mouseleave",".J-weixin-trigger",function(a){"mouseenter"===a.type?d.find(".weixin-tips").stop().fadeIn(100):d.find(".weixin-tips").stop().fadeOut(100)}),d.on("click",".J-weixin-trigger",function(){d.find(".weixin-tips").stop().fadeToggle(100)})}),define("sjplus/global/0.0.1/weixin-weibo-float-menu/menu.css",[],function(){seajs.importStyle("#weixin-weibo-float-menu-wrapper{position:fixed;right:12px;bottom:12px;z-index:9}#weixin-weibo-float-menu div.item{width:45px;height:45px;background:#bebfb3;text-align:center;line-height:40px;margin-bottom:5px;border-radius:4px;color:#383838;position:relative}#weixin-weibo-float-menu div.item .icon-content{width:45px;height:45px;position:relative;text-align:center;border-radius:4px}#weixin-weibo-float-menu div.item .icon-content .icon{font-size:24px;line-height:24px;width:100%;height:100%;position:absolute;top:10px;left:0;cursor:default}#weixin-weibo-float-menu div.item .icon-content b.icon{visibility:hidden}#weixin-weibo-float-menu div.item .icon-content:hover{background:#ff3b35;color:#fff}#weixin-weibo-float-menu div.item .icon-content:hover span.icon{visibility:hidden}#weixin-weibo-float-menu div.item .icon-content:hover b.icon{visibility:visible}#weixin-weibo-float-menu .weixin-tips img{display:block;width:147px;height:147px}#weixin-weibo-float-menu .weixin-tips{border:solid 3px #bebfb3;position:absolute;left:-160px;top:-100px}")}),define("sjplus/global/0.0.1/weixin-weibo-float-menu/menu.tpl",[],'<div id="weixin-weibo-float-menu">\n    <div class="item J-top">\n        <div class="icon-content">\n            <span class="icon icon-untitled-15"></span>\n            <b class="icon icon-untitled-15"></b>\n        </div>\n    </div>\n    <div class="item J-weixin">\n        <div class="icon-content J-weixin-trigger">\n            <span class="icon icon-untitled-24"></span>\n            <b class="icon icon-untitled-31"></b>\n        </div>\n        <div class="weixin-tips hide">\n            <img src="http://www.sjplus.cn/read/5295ea60a781722049000005.jpg">\n        </div>\n    </div>\n    <!--<div class="item J-weibo">\n        <div class="icon-content">\n            <span class="icon  icon-untitled-18"></span>\n            <b class="icon icon-untitled-29"></b>\n        </div>\n    </div>-->\n</div>\n');
