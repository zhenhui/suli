define("sjplus/register/0.0.1/init",["sjplus/global/0.0.1/crypto/sha3"],function(a){function b(a){m.html(a),l.slideDown()}function c(){l.slideUp()}function d(){o.find("img")[0].src="/captcha?t="+(new Date).getTime()}var e=document.forms.register,f=KISSY,g=a("sjplus/global/0.0.1/crypto/sha3"),h=$(e),i=e.elements,j=/(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,k=/^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9_-]{2,28}$/,l=$("#tips-wrapper"),m=l.find(".tips-content"),n={"163.com":"http://mail.163.com/","10086.cn":"http://mail.10086.cn/","sohu.com":"http://mail.sohu.com/","qq.com":"http://mail.qq.com/","189.cn":"http://mail.189.cn/","126.com":"http://www.126.com/","gmail.com":"https://mail.google.com/","sina.com":"http://mail.sina.com.cn/","outlook.com":"http://www.outlook.com/","aliyun.com":"http://mail.aliyun.com/","tom.com":"http://mail.tom.com/","sogou.com":"http://mail.sogou.com/","2980.com":"http://www.2980.com/","21cn.com":"http://mail.21cn.com/","188.com":"http://www.188.com/","yeah.net":"http://www.yeah.net/","foxmail.com":"http://www.foxmail.com/","wo.com.cn":"http://mail.wo.com.cn/","263.net":"http://www.263.net/"};h.on("keydown",function(a){console.log(a.target),c()}),h.on("submit",function(a){a.preventDefault();var c=$.trim(i._.value),h=$.trim(i.__.value),m=i.___.value,o=i.captcha.value,p=i["read-rule"],q=[];return k.test(c)||($(i._).addClass("error"),q.push("用户名不符合规则")),j.test(h)||(q.push("邮箱格式不正确"),$(i.__).addClass("error")),/^[^\s]{3,}$/.test(m)||(q.push("密码不符合规则"),$(i.___).addClass("error")),/^[^\s]{4}$/.test(o)||(q.push("验证码请输入正确"),$(i.___).addClass("error")),p.checked&&"yes"===p.value||(q.push("请同意注册协议"),$(i.___).addClass("error")),q.length>0?(b(f.map(q,function(a,b){return"<p>"+(b+1)+"："+a+"</p>"})),console.log("register abort"),void 0):($.ajax({url:e.action,type:"post",data:{_:c,__:h,___:g(m).toString(),captcha:e.elements.captcha.value,readRule:p.checked&&p.value,_csrf:window._csrf_token_},dataType:"json"}).done(function(a){var c=h.substring(h.indexOf("@")+1);if(1===a.status)return $("#submit-wrapper").slideUp(100,function(){$("#submit-wrapper").remove()}),$(".require-field").slideUp(100),n[c]?b('视界+发送了一封邮件到您的邮箱中， <a href="'+n[c]+'" style="text-decoration:underline;">现在就去验证!</a> '):b("<p>视界+发送了一封邮件到："+h+"。</p><p>如未找到，请检查垃圾邮箱中是否存在。</p>"),l.addClass("success").slideDown(),void 0;switch(d(),e.elements.captcha.value="",a.status){case-1:var g=[];f.each(a.err,function(a){f.each(f.keys(a),function(b){g.push("<p>"+a[b]+"</p>")})}),b(g.join(""));break;case-2:b("生成注册详情时出错");break;case-4:b("创建用户失败");break;case-5:b("无法发送注册邮件，请联系管理员");break;case-10:b("验证码错误")}}).error(function(){d(),b("服务器内部错误，请联系管理员。")}),void 0)});var o=$("#captchaTrigger");o.on("click",d)});
