<div id="design-container">
    <div class="list-area">
        <ul class="list clearfix">
            #if(docs.length>0)
            #each(item,index in docs)
            <li id="J-design-works-#{item._id}"><a href="/design-works/detail/#{item._id}">
                <img src="/read/#{item.thumbnails_id.split(':')[0]}"
                     alt="#{item.content.replace(/[\r\n]/gmi,'')}"
                     width="230" height="175" class="avatar"></a>
                <div class="control">
                    <a class="J-delete-design-works" data-id="#{item._id}" href="javascript:void(0)">删除</a>
                </div>
            </li>
            #end
            #else
            <li>暂无数据</li>
            #end
        </ul>
    </div>
</div>