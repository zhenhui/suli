/*
Copyright 2013, KISSY UI Library v1.31
MIT Licensed
build time: Aug 15 00:07
*/
KISSY.add("resizable",function(q,c,j,k,r){function s(a){var g=a.dds,d=a.get("node"),h=a.get("handlers"),e=a.get("prefixCls")+t;for(b=0;b<h.length;b++){var l=h[b],i=n("<div class='"+e+" "+e+"-"+l+"'></div>").prependTo(d,r),i=g[l]=new u({node:i,cursor:null});(function(g,f){f.on("drag",function(d){var f=a.get("node"),h=d.target,e=a._width,i=a._height,l=a.get("minWidth"),c=a.get("maxWidth"),j=a.get("minHeight"),k=a.get("maxHeight"),n=d.top-h.get("startNodePos").top,d=d.left-h.get("startNodePos").left,
e=m[g](l,c,j,k,a._top,a._left,e,i,n,d);for(b=0;b<o.length;b++)e[b]&&f.css(o[b],e[b]);a.fire("resize",{handler:g,dd:h})});f.on("dragstart",function(){a._width=d.width();a._top=parseInt(d.css("top"));a._left=parseInt(d.css("left"));a._height=d.height();a.fire("resizeStart",{handler:g,dd:f})});f.on("dragend",function(){a.fire("resizeEnd",{handler:g,dd:f})})})(l,i)}}var n=c.all,b,u=k.Draggable,t="resizable-handler",k=["l","r"],p=["t","b"],o=["width","height","top","left"],m={t:function(a,g,b,h,e,l,i,
c,f){a=Math.min(Math.max(b,c-f),h);return[0,a,e+c-a,0]},b:function(a,g,b,h,e,c,i,j,f){return[0,Math.min(Math.max(b,j+f),h),0,0]},r:function(a,b,d,h,e,c,i,j,f,k){return[Math.min(Math.max(a,i+k),b),0,0,0]},l:function(a,b,d,h,e,c,i,j,f,k){a=Math.min(Math.max(a,i-k),b);return[a,0,0,c+i-a]}};for(b=0;b<k.length;b++)for(c=0;c<p.length;c++)(function(a,g){m[a+g]=m[g+a]=function(){var d=m[a].apply(this,arguments),c=m[g].apply(this,arguments),e=[];for(b=0;b<d.length;b++)e[b]=d[b]||c[b];return e}})(k[b],p[c]);
j=j.extend({initializer:function(){this.dds={}},_onSetNode:function(){s(this)},_onSetDisabled:function(a){q.each(this.dds,function(b){b.set("disabled",a)})},destructor:function(){var a,b=this.dds;for(a in b)b[a].destroy(),b[a].get("node").remove(),delete b[a]}},{ATTRS:{node:{setter:function(a){return n(a)}},prefixCls:{value:"ks-"},disabled:{},minWidth:{value:0},minHeight:{value:0},maxWidth:{value:Number.MAX_VALUE},maxHeight:{value:Number.MAX_VALUE},handlers:{value:[]}}});j.Handler={B:"b",T:"t",L:"l",
R:"r",BL:"bl",TL:"tl",BR:"br",TR:"tr"};return j},{requires:["node","rich-base","dd/base"]});
