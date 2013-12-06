<div id="design-container">
    <div class="list-area">
        <ul class="list design-works-list clearfix">
            #if(data.length>0)
            #each(item,index in data)
            <li id="J-design-works-#{item._id}">
                <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>
                <a href="/design-works/detail/#{item._id}" class="link" target="_blank"></a>
                <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">
                <div class="control">
                    <a class="J-unlike-design-works" data-id="#{item._id}" href="javascript:void(0)">取消喜欢</a>
                </div>
            </li>
            #end
            #else
            <li>暂无数据</li>
            #end
        </ul>
    </div>
</div>