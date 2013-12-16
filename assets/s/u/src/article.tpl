<div id="article-container">
    #each(item in data)
    <div class="article"><h2><a class="J-user-card" data-user-id="#{item.owner_id}" href="/u/#{item.owner_id}"><img src="#{imgCDN}/avatar/#{item.owner_id}_30x30" class="avatar"></a><span
            class="title"><a href="/article/#{item.title}">#{item.title}</a></span><span class="tag">【#{item.tag.join(' ')}】</span><span
            class="date">todo</span>
    </h2>

        <p class="banner"><a href="/article/#{item.title}"><img width="770" height="200"
                                                                src="#{imgCDN}/read/#{item.thumbnails_id}"></a>
        </p>

        <div class="content">#{item.content}</div>
    </div>
    #end
</div>