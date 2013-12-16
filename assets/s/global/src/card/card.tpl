<a id="global-user-card-avatar" style="background-image:url(/avatar/#{_id}_80x80)"></a>
    <p class="user">#{user}</p>
#if(typeof privacy_information!=='undefined')
#run var user=privacy_information
    <p class="address">#if(user.address)<span class="icon-untitled-3"></span>#{user.address.value}#end</p>
#if(user.qq || user.zone_url)
<div id="global-user-card-type">
    #if(user.qq)
    <a class="qq icon-untitled-2" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=#{user.qq.value}&site=qq&menu=yes"></a>
    #end
    #if(user.zone_url)
    <a href="#{user.zone_url.value}" class="sina-weibo icon-untitled-28"></a>
    #end
</div>
#end
#end