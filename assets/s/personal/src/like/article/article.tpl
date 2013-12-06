<div id="article-container">
    #if(typeof docs!=='undefined')
    #each(item,index in docs)
    #run var date=new Date(item.ts)
    <div class="article">
        <h2>#{item.title}<span class="tag">【#{item.tag.join(',')}】</span><span class="date">#{date.getFullYear()}年#{date.getMonth()+1}月</span></h2>

        <p class="banner"><img width="770" height="200" src="#{imgCDN}/read/#{item.thumbnails_id.split(':')[0]}"></p>

        <div class="content">#{item.content}...</div>
    </div>
    #end
    #end
</div>