
<div class="item-container J-comment-item ks-waterfall" data-owner-id="#{owner_id}">
    <div class="container">
        <div class="user-info">
            <div class="user"><a class="avatar"><img src="#{imgCDN}/avatar/#{owner_id}_20x20"></a><span
                    class="user-name">#if(typeof owner_user==='string')#{owner_user}#end</span></div>
            <div class="date">
                #run var date=new Date(ts)
                #{date.getFullYear()}.#{date.getMonth()+1}.#{date.getDate()}-#{date.getHours()}:#{date.getMinutes()}:#{date.getSeconds()}
            </div>
        </div>
        <div class="content J-comment-area">#{content}<div class="J-reply-trigger reply-trigger"><a href="#" class="J-reply">回复</a></div>
        </div>
        <!--<ul>
            <li><a class="avatar"><img
                    src="http://dribbble.s3.amazonaws.com/users/49563/avatars/original/f7c80d46.jpg?1325837502"></a>打酱油的？
            </li>
            <li><a class="avatar"><img
                    src="http://dribbble.s3.amazonaws.com/users/49563/avatars/original/f7c80d46.jpg?1325837502"></a>打酱油的？
            </li>
        </ul>-->
    </div>
</div>
