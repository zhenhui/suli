define("sjplus/global/0.0.1/comment/comment",["template","sjplus/global/0.0.1/login/login","./comment-block.tpl","./comment.css","./comment-textarea.tpl"],function(a,b){function c(){l.scrollTop()+l.height()>i.offset().top&&(l.off("scroll",c),d())}function d(){a("./comment.css"),e(),$("#J-comment-wrapper").html(a("./comment-textarea.tpl")),f=i.find("h2")}function e(){KISSY.use("gallery/waterfall/1.0/,node,ajax,dom,event",function(a,c,d,e){var h=(d.all,1),i=!0;b.waterfall=new c.Loader({container:"#comment-container",load:function(b,c){e({data:{id:j,page:h,per_page:10},url:"/comment/list",dataType:"jsonp",success:function(d){if(i&&d.total_count>0&&(f.html(d.total_count>0?'<span class="J-count">'+d.total_count+"</span>条评论":"暂无评论"),i=!1),"ok"!==d.status)return c(),i&&(f.html('<span class="J-count">0</span>条评论'),i=!1),void 0;var e=[];a.each(d.docs,function(b){e.push(new a.Node(g.render(n,b)))}),h=d.page+1,h>d.total_page&&c(),b(e)},complete:function(){}})},minColCount:2,colWidth:390})})}var f,g=a("template"),h=a("sjplus/global/0.0.1/login/login"),i=$("#J-comment-wrapper"),j=i.attr("data-page-id"),k=i.attr("data-type"),l=$(window),m=a("./comment-block.tpl"),n=g.compile(m);l.on("scroll",c),c();var o=$(document.body);o.on("click",".J-send-new-comment-trigger",function(){var a=$(this),c=a.parents(".J-new-comment"),d=c.find("textarea"),e=d.val();$.post("/comment/new",{content:e,_csrf:window._csrf_token_,_id:j,type:k},function(a){if(a.docs){$(g.render(n,a.docs)).insertAfter($("#comment-container>div.ks-waterfall").eq(0)),b.waterfall.adjust();var c=parseInt(f.find("span.J-count").html(),10);f.find("span.J-count").html(c+1),d.val(""),$(".J-comment").find(".J-count").html(c+1)}else-1==a.status?h.login():alert("遇到错误：\r\n"+a.err.join("\r\n"))})}),o.on("click",".J-comment-trigger",function(){$("#J-comment-textarea").focus()})}),define("sjplus/global/0.0.1/comment/comment-block.tpl",[],'<div class="item-container J-comment-item ks-waterfall" data-owner-id="#{owner_id}">\n    <div class="container">\n        <div class="user-info">\n            <div class="user"><a class="avatar J-user-card" data-user-id="#{owner_id}" href="/u/#{owner_id}"><img src="#{imgCDN}/avatar/#{owner_id}_20x20"></a><span\n                    class="user-name">#if(typeof owner_user===\'string\')#{owner_user}#end</span></div>\n            <div class="date">\n                #run var date=new Date(ts)\n                #{date.getFullYear()}.#{date.getMonth()+1}.#{date.getDate()}-#{date.getHours()}:#{date.getMinutes()}:#{date.getSeconds()}\n            </div>\n        </div>\n        <div class="content J-comment-area">#{content}<div class="J-reply-trigger reply-trigger">\n            <a href="#" class="J-reply">回复</a></div>\n        </div>\n    </div>\n</div>\n'),define("sjplus/global/0.0.1/comment/comment.css",[],function(){seajs.importStyle(".comment-container{position:relative}.J-comment-container{width:790px;overflow:hidden;margin-top:23px}.J-comment-container h2{font-size:14px;margin-bottom:12px}.comment-container .ks-waterfall-col-0{left:0!important}.comment-container .ks-waterfall-col-1{margin-left:5px}.comment-container .item-container{width:390px;overflow:hidden;position:absolute}.comment-container .item-container .user-info{padding:11px 13px}.comment-container .container{position:relative;background:#fff;padding-bottom:13px;margin-bottom:10px}.comment-container .container .content{margin:0 13px;white-space:pre}.comment-container .container .reply-trigger{text-align:right;padding:12px 0;display:none}.comment-container .container .reply a{color:#999}.comment-container a.avatar{display:inline-block;vertical-align:middle;margin-right:5px}.comment-container a.avatar img{width:20px;height:20px;display:inline-block;vertical-align:middle;border-radius:2px}.comment-container span.user-name{margin-left:5px;color:#999}.comment-container .container .date{position:absolute;right:13px;top:11px;color:#999}.comment-container .container ul{margin:0 13px}.comment-container .container ul li{line-height:normal;padding:5px 0}.J-reply-container{text-align:right;margin:12px 0}.J-reply-container textarea{width:352px;height:46px;background:#bebfb3;border:0;padding:10px 0 0 10px;color:#333;resize:none}.new-comment{margin-bottom:10px;background:#fff;padding-bottom:10px}.new-comment textarea{margin:10px 0 0 10px;width:365px;border:0;resize:none;background:#bebfb3;border:0;padding:10px 0 0 10px;height:63px;overflow:auto}.new-comment .btn{margin-right:5px;margin-top:5px}.J-send-new-comment{text-align:right}")}),define("sjplus/global/0.0.1/comment/comment-textarea.tpl",[],'<div id="J-comment-container" data-id="#{page-id}" class="J-comment-container"><h2>正在加载评论...</h2>\n    <div id="comment-container" class="comment-container">\n        <div class="item-container new-comment J-new-comment ks-waterfall">\n            <textarea id="J-comment-textarea" data-id="#{page-id}"></textarea>\n            <div class="J-send-new-comment">\n                <button class="J-send-new-comment-trigger btn btn-normal">发送</button>\n            </div>\n        </div>\n    </div>\n</div>\n');
