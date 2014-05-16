<div id="loginSmallDialog" class="login-small-dialog">
    <div class="wrapper">

        <h2>登 陆</h2>

        <div id="login-trigger">
            <div class="trigger">
                <a id="domain-login"><span><!--域帐号--></span></a>
            </div>
            <!--<div class="trigger">
                <a id="email-login"><span>邮箱登陆</span></a>
            </div>-->
            <!--<div class="trigger">
                <a id="weibo-login"><span>微博登陆</span></a>
            </div>-->

        </div>

        <form action="/login" method="post">
            <input class="text" type="text" name="user-name" placeholder="用户名" id="J-login-user-name-field">
            <input class="text" type="password" name="pwd" placeholder="密码">
            <input class="btn J-login-submit-triggers" type="submit" value="登陆"/>
        </form>
    </div>
</div>
