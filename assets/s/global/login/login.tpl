#if(status<1)

<div class="login-small-dialog">
    <div class="wrapper">

        <h2>登 陆</h2>

        <div id="login-trigger">
            <div class="trigger">
                <a id="domain-login" href=""><span>域帐号</span></a>
            </div>
            <!--<div class="trigger">
                <a id="email-login" href=""><span>邮箱登陆</span></a>
            </div>-->
            <!--<div class="trigger">
                <a id="weibo-login" href=""><span>微博登陆</span></a>
            </div>-->

        </div>

        <form action="/login" method="post">
            <input class="text" type="text" name="user-name" placeholder="用户名" id="J-login-user-name-field">
            <input class="text" type="password" name="pwd" placeholder="密码">
            <input class="btn J-login-submit-triggers" type="submit" value="登陆" />
        </form>
    </div>
</div>

#elseif(status==1)

<div class="login-user-info J-logged-list-triggers">

    <span class="avatar">
        <a href="/u/#{_id}"><img class="J-avatar-own-20" src="#{imgCDN}/avatar/#{_id}_20x20"><i></i></a>
    </span>
    <span class="J-user-name">#{user}</span>
</div>

#elseif(status=="logged")
<div class="logged-list J-logged-list">
    <div class="list">
        <ul>
            <li><a class="J-publish-work">发布作品</a></li>
            <li><a href='/personal#all-works{"view":"design"}'>管理设计作品</a></li>
            <li><a href="/personal#account-setting">设置帐号</a></li>
            <li><a href="/login/login-out">退出</a></li>
        </ul>
    </div>
</div>
#end