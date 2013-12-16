<a href="/u/#{_id}" class="avatar">
    <img src="/avatar/#{_id}_80x80">
</a>
<div class="info">
    <h2>#{user}</h2>
    #if(typeof privacy_information!=='undefined')
    #run var privacy = privacy_information
    #if(typeof privacy.address!=='undefined')<p class="address">#{privacy.address.value}</p>#end
    #if(typeof privacy.job!=='undefined')<p class="job">#{privacy.job.value}</p>#end
    #end
</div>
<div class="count" id="J-navigation-trigger">
    <a class="design-works" href="#design-works">
        <span class="num">#if(index["design-works"])#{index["design-works"]}#else0#end</span>
        <span class="title">作品</span>
        <s></s>
    </a>
    <a class="article" href="#article">
        <span class="num">#if(index["article"])#{index["article"]}#else0#end</span>
        <span class="title">文章</span>
        <s></s>
    </a>
</div>
