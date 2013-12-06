define("sjplus/personal/0.0.1/account/init",["template","./account.tpl","./account.css","sjplus/global/0.0.1/crypto/sha3"],function(a,b,c){var d=a("template"),e=a("./account.tpl");a("./account.css");var f=$("#main-js-container"),g=c.id+"_uploadCallBack";b.init=function(){$.getJSON("/admin/user/get/personal-information?r"+Math.random(),function(a){if(a.status>0){f.html(d.render(e,a));var b=document.forms["upload-image-form"];b.elements["callback-func-name"].value=g;{$(b).find("#upload-avatar-label")}window[g]||(window[g]=function(a){if(a.err)alert(a.err.join("\r\n"));else{var b=window.imgCDN+"/avatar/"+a._id+"_80x80?r="+Math.random();$("#upload-image-preview")[0].src=b,$("#upload-avatar-id").val(a._id),$("img.J-avatar-own-20").attr("src","/avatar/"+a._id+"_20x20?r="+Math.random()),$("img.J-avatar-own-80").attr("src",b)}})}else f.html("登陆失效，请刷新页面重新登陆")})};var h=a("sjplus/global/0.0.1/crypto/sha3");f.on("submit","form#admin-user-update-password",function(a){a.preventDefault();var b=a.currentTarget,c=b.elements["origin-pwd"].value,d=b.elements["new-pwd"].value,e=b.elements["confirm-pwd"].value;return""===c||d!==e?(alert("请输入原密码和新密码"),void 0):(c=h(c).toString(),d=h(d).toString(),$.post(b.action,{p1:c,p2:d,_csrf:window._csrf_token_},function(a){a.status>0?alert("更新成功！"):alert("发生错误："+a.err.join(","))},"json"),void 0)}),f.on("submit","form#admin-user-information",function(a){a.preventDefault();var b=a.currentTarget;$.post(b.action,$(a.currentTarget).serialize(),function(a){a.status>0?alert("更新成功"):alert("更新失败")},"json")})}),define("sjplus/personal/0.0.1/account/account.tpl",[],'<div id="account-setting">\n    <div class="container"><h3>帐户设置</h3>\n\n        <div class="item">\n            <h4>基本信息</h4>\n\n            <form target="upload-image" enctype="multipart/form-data" id="upload-image-form" data-callback-id=""\n                  method="post" action="/upload/avatar">\n                <input type="hidden" name="_csrf" value="#{window._csrf_token_}" />\n                <table>\n                    <tr>\n                        <th style="vertical-align: top;">头像</th>\n                        <td>\n                            <div class="upload-avatar">\n                                <img id="upload-image-preview" src="#{imgCDN}/avatar/#{data._id}_80x80">\n                                <input type="hidden" name="callback-func-name"/>\n                                <input type="hidden" id="upload-avatar-id" name="result-field">\n\n                                <div style="width:0;height:0;overflow:hidden"><input type="file" name="file"\n                                                                                     onchange="this.form.submit()"\n                                                                                     id="upload-avatar"></div>\n                                <label id="upload-avatar-label" for="upload-avatar">\n                                    <span><b>上传头像<br>80x80</b></span>\n                                </label>\n                            </div>\n                        </td>\n                    </tr>\n                </table>\n            </form>\n\n        </div>\n        <div class="item">\n            <h2>密码管理</h2>\n\n            <form action="/admin/user/update/password" method="post" id="admin-user-update-password">\n                <table>\n                    <tr>\n                        <th>原密码</th>\n                        <td><input name="origin-pwd" class="text-field text-field-normal" type="password"></td>\n                    </tr>\n                    <tr>\n                        <th>新密码</th>\n                        <td><input name="new-pwd" class="text-field text-field-normal" type="password"></td>\n                    </tr>\n                    <tr>\n                        <th>确认密码</th>\n                        <td><input name="confirm-pwd" class="text-field text-field-normal" type="password"></td>\n                    </tr>\n                    <tr>\n                        <th></th>\n                        <td><input type="submit" class="btn btn-large" value="更新"></td>\n                    </tr>\n                </table>\n            </form>\n        </div>\n        <div class="item">\n            <h2>个人信息</h2>\n\n            #run var info = data.privacy_information ? data.privacy_information : {}\n            <form action="/admin/user/update/information" method="post" id="admin-user-information">\n                <input type="hidden" name="_csrf" value="#{window._csrf_token_}" />\n                <table>\n                    <tr>\n                        <th>隐私性</th>\n                        <td>以下信息对登陆用户可见，如有所顾虑，请清空对应信息并更新。</td>\n                    </tr>\n                    <tr>\n                        <th>城市或地区</th>\n                        <td><input name="address" class="text-field text-field-normal" type="text" value="#if(info.address)#{info.address.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th>职业</th>\n                        <td><input name="job" class="text-field text-field-normal" type="text" value="#if(info.job)#{info.job.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th>QQ</th>\n                        <td><input name="qq" class="text-field text-field-normal" type="text" value="#if(info.qq)#{info.qq.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th>微博地址或个人网址</th>\n                        <td><input name="zone_url" placeholder="http://示例.com" class="text-field text-field-normal" type="text" value="#if(info.zone_url)#{info.zone_url.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th></th>\n                        <td><input type="submit" class="btn btn-large" value="更新"></td>\n                    </tr>\n                </table>\n            </form>\n        </div>\n    </div>\n</div>'),define("sjplus/personal/0.0.1/account/account.css",[],function(){seajs.importStyle("#account-setting .item{position:relative}#account-setting .item h4{font-size:14px;position:absolute;left:0;top:0}#account-setting h3{margin-bottom:33px}#account-setting table{width:100%}#account-setting th,#account-setting td{padding:6px}#account-setting th{width:137px;text-align:right;padding-right:12px}#account-setting .upload-avatar{width:80px;height:80px;position:relative}#account-setting .upload-avatar img{width:80px;height:80px}#account-setting .upload-avatar label{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;text-align:center;background:url(/read/5287721f3199569a24000151.gif);color:#eee;cursor:pointer}#account-setting .upload-avatar label span{position:absolute;left:0;top:0;width:100%;height:100%;filter:progid:DXImageTransform.Microsoft.gradient(enabled='true', startColorstr='#66000000', endColorstr='#66000000');background:rgba(0,0,0,.4)}#account-setting .upload-avatar label b{position:absolute;left:13px;top:23px;font-weight:400}")});
