<div id="manage-design-works">
    <div class="container"><h3>管理共享文件</h3>

        <div class="list-area">
            <ul class="list clearfix">
                #if(typeof docs!=='undefined')
                #each(item,index in docs)
                <li><a href="/design-works/detail/#{item._id}"><img
                        src="/read/#{item.thumbnails_id.split(':')[0]}" alt="#{item.content.replace(/[\r\n]/gmi,'')}"
                        width="230" height="175"
                        class="avatar"></a>

                    <div class="user"><a class="avatar"><img src=""></a><span class="info">#{item.title}</span></div>
                </li>
                #end
                #else
                <li>暂无数据</li>
                #end
            </ul>
        </div>
    </div>
</div>