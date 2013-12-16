<div id="design-works-container">
    <ul class="clearfix design-works-list">
        #each(item in data)
        <li>
            <div class="describe"><h2>#{item.title}</h2><p>#{item.content}</p></div>
            <img src="#{imgCDN}/read/#{item.thumbnails_id}" class="thumbnails">
            <a href="#{hostDOMAIN}/design-works/detail/#{item._id}" class="link"></a>
            <div class="avatar J-user-card" data-user-id="#{item.owner_id}">
                <a href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_20x20"></a>
            </div>
            <div class="info">
                <span class="view"> <b class="data-icon" data-icon="&#xe00a;"></b> #{item.index.view} </span>
                <span class="like"> <b class="data-icon" data-icon="&#xe007;"></b> #{item.index.like} </span>
                <span class="comment"> <b class="data-icon" data-icon="&#xe015;"></b> #{item.index.comment} </span>
            </div>
        </li>
        #end
    </ul>
</div>