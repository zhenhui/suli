<div id="design-container">
    <div class="list-area">
        <ul class="list clearfix">
            #if(data.length>0)
            #each(item,index in data)
            <li id="J-design-works-#{item._id}"><a href="/design-works/detail/#{item._id}">
                <img src="#{imgCDN}/read/#{item.thumbnails_id}"
                     width="230" height="175" class="avatar"></a>
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