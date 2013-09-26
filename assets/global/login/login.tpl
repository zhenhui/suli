#if(status<1)

<div class="login-small-dialog">
    <div class="wrapper">
        <div class="title">域帐号登陆</div>
        <form action="/login" method="post">
            <input class="text" type="text" name="user-name" placeholder="用户名" id="J-login-user-name-field">
            <input class="text" type="text" name="pwd" placeholder="密码">
            <input class="btn J-login-submit-triggers" type="submit"/>
        </form>
    </div>
</div>

#elseif(status==1)

<div class="login-user-info J-logged-list-triggers">
    <span class="avatar">
        <img class="J-avatar-own-20" src="/avatar/#{_id}_20x20"><i></i>
    </span>
    <span class="J-user-name">#{name}</span>
</div>

#elseif(status=="logged")
<div class="logged-list J-logged-list">
    <div class="list">
        <ul>
            <li><a href="#">信息</a></li>
            <li><a class="J-publish-work">发布作品</a></li>
            <li><a href="/personal#manage-share">管理设计作品</a></li>
            <li><a href="/admin/user">设置帐号</a></li>
            <li><a href="/login/login-out">退出</a></li>
        </ul>
    </div>
</div>
#end