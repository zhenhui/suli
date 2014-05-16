/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-9-25
 * Time: 下午8:46
 * To change this template use File | Settings | File Templates.
 */
define("sjplus/personal/0.0.1/account/init-debug", [ "template-debug", "./account-debug.tpl", "./account-debug.css", "sjplus/global/0.0.1/crypto/sha3-debug" ], function(require, exports, module) {
    var template = require("template-debug");
    var tpl = require("./account-debug.tpl");
    require("./account-debug.css");
    var $container = $("#main-js-container");
    //生成一个回调函数名
    var callback = module.id + "_uploadCallBack";
    exports.init = function(data, hash) {
        $.getJSON("/admin/user/get/personal-information?r" + Math.random(), function(docs) {
            if (docs.status > 0) {
                $container.html(template.render(tpl, docs));
                var form = document.forms["upload-image-form"];
                form.elements["callback-func-name"].value = callback;
                var $label = $(form).find("#upload-avatar-label");
                //定义回调，上传完成后调用此处
                if (!window[callback]) {
                    window[callback] = function(data) {
                        if (data.err) {
                            alert(data.err.join("\r\n"));
                        } else {
                            var src = window.imgCDN + "/avatar/" + data._id + "_80x80?r=" + Math.random();
                            $("#upload-image-preview")[0].src = src;
                            $("#upload-avatar-id").val(data._id);
                            $("img.J-avatar-own-20").attr("src", "/avatar/" + data._id + "_20x20?r=" + Math.random());
                            $("img.J-avatar-own-80").attr("src", src);
                        }
                    };
                }
                if (data.highlight) {
                    $("#modify-pwd").css({
                        border: "solid 1px #ff3b35",
                        padding: "12",
                        margin: "12px 0",
                        borderLeft: "solid 5px #ff3b35"
                    }).find('input[name="origin-pwd"]').focus();
                }
            } else {
                $container.html("登陆失效，请刷新页面重新登陆");
            }
        });
    };
    var sha3 = require("sjplus/global/0.0.1/crypto/sha3-debug");
    //更新密码
    $container.on("submit", "form#admin-user-update-password", function(ev) {
        ev.preventDefault();
        var form = ev.currentTarget;
        var p1 = form.elements["origin-pwd"].value;
        var p2 = form.elements["new-pwd"].value;
        var p3 = form.elements["confirm-pwd"].value;
        if (p1 === "" || p2 !== p3) {
            alert("请输入原密码和新密码");
            return;
        }
        p1 = sha3(p1).toString();
        p2 = sha3(p2).toString();
        $.post(form.action, {
            p1: p1,
            p2: p2,
            _csrf: window._csrf_token_
        }, function(data) {
            if (data.status > 0) {
                alert("更新成功！");
                location.hash = "#account-setting";
                window.location.reload();
            } else {
                alert("发生错误：" + data.err.join(","));
            }
        }, "json");
    });
    //更新个人信息
    $container.on("submit", "form#admin-user-information", function(ev) {
        ev.preventDefault();
        var form = ev.currentTarget;
        $.post(form.action, $(ev.currentTarget).serialize(), function(data) {
            if (data.status > 0) {
                alert("更新成功");
            } else {
                alert("更新失败");
            }
        }, "json");
    });
});

define("sjplus/personal/0.0.1/account/account-debug.tpl", [], '<div id="account-setting">\n    <div class="container"><h3>帐户设置</h3>\n\n        <div class="item">\n            <h4>基本信息</h4>\n\n            <form target="upload-image" enctype="multipart/form-data" id="upload-image-form" data-callback-id=""\n                  method="post" action="/upload/avatar">\n                <input type="hidden" name="_csrf" value="#{window._csrf_token_}" />\n                <table>\n                    <tr>\n                        <th style="vertical-align: top;">头像</th>\n                        <td>\n                            <div class="upload-avatar">\n                                <img id="upload-image-preview" src="#{imgCDN}/avatar/#{data._id}_80x80">\n                                <input type="hidden" name="callback-func-name"/>\n                                <input type="hidden" id="upload-avatar-id" name="result-field">\n\n                                <div style="width:0;height:0;overflow:hidden"><input type="file" name="file"\n                                                                                     onchange="this.form.submit()"\n                                                                                     id="upload-avatar"></div>\n                                <label id="upload-avatar-label" for="upload-avatar">\n                                    <span><b>上传头像<br>80x80</b></span>\n                                </label>\n                            </div>\n                        </td>\n                    </tr>\n                </table>\n            </form>\n\n        </div>\n        <div class="item" id="modify-pwd">\n            <h2>密码管理</h2>\n\n            <form action="/admin/user/update/password" method="post" id="admin-user-update-password">\n                <table>\n                    <tr>\n                        <th>原密码</th>\n                        <td><input name="origin-pwd" class="text-field text-field-normal" type="password"></td>\n                    </tr>\n                    <tr>\n                        <th>新密码</th>\n                        <td><input name="new-pwd" class="text-field text-field-normal" type="password"></td>\n                    </tr>\n                    <tr>\n                        <th>确认密码</th>\n                        <td><input name="confirm-pwd" class="text-field text-field-normal" type="password"></td>\n                    </tr>\n                    <tr>\n                        <th></th>\n                        <td><input type="submit" class="btn btn-large" value="更新"></td>\n                    </tr>\n                </table>\n            </form>\n        </div>\n        <div class="item">\n            <h2>个人信息</h2>\n\n            #run var info = data.privacy_information ? data.privacy_information : {}\n            <form action="/admin/user/update/information" method="post" id="admin-user-information">\n                <input type="hidden" name="_csrf" value="#{window._csrf_token_}" />\n                <table>\n                    <tr>\n                        <th>隐私性</th>\n                        <td>以下信息对登陆用户可见，如有所顾虑，请清空对应信息并更新。</td>\n                    </tr>\n                    <tr>\n                        <th>城市或地区</th>\n                        <td><input name="address" class="text-field text-field-normal" type="text" value="#if(info.address)#{info.address.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th>职业</th>\n                        <td><input name="job" class="text-field text-field-normal" type="text" value="#if(info.job)#{info.job.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th>QQ</th>\n                        <td><input name="qq" class="text-field text-field-normal" type="text" value="#if(info.qq)#{info.qq.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th>微博地址或个人网址</th>\n                        <td><input name="zone_url" placeholder="http://示例.com" class="text-field text-field-normal" type="text" value="#if(info.zone_url)#{info.zone_url.value}#end"></td>\n                    </tr>\n                    <tr>\n                        <th></th>\n                        <td><input type="submit" class="btn btn-large" value="更新"></td>\n                    </tr>\n                </table>\n            </form>\n        </div>\n    </div>\n</div>');

define("sjplus/personal/0.0.1/account/account-debug.css", [], function() {
    seajs.importStyle("#account-setting .item{position:relative}#account-setting .item h4{font-size:14px;position:absolute;left:0;top:0}#account-setting h3{margin-bottom:33px}#account-setting table{width:100%}#account-setting th,#account-setting td{padding:6px}#account-setting th{width:137px;text-align:right;padding-right:12px}#account-setting .upload-avatar{width:80px;height:80px;position:relative}#account-setting .upload-avatar img{width:80px;height:80px}#account-setting .upload-avatar label{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;text-align:center;background:url(/read/5287721f3199569a24000151.gif);color:#eee;cursor:pointer}#account-setting .upload-avatar label span{position:absolute;left:0;top:0;width:100%;height:100%;filter:progid:DXImageTransform.Microsoft.gradient(enabled='true', startColorstr='#66000000', endColorstr='#66000000');background:rgba(0,0,0,.4)}#account-setting .upload-avatar label b{position:absolute;left:13px;top:23px;font-weight:400}");
});
