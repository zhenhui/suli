<div id="design-container">
    <div class="list-area">
        <ul class="list design-works-list clearfix">
            #if(docs.length>0)
            #each(item,index in docs)
            <li id="J-design-works-#{item._id}">
                <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>
                <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">
                <a href="#{hostDOMAIN}/design-works/detail/#{item._id}" class="link" target="_blank"></a>
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