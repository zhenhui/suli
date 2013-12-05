<ul>
    #js
    for(var k in data){
    #end
    <li><a href="?category=#{k}" class="J-category" data-category="#{k}">#{k}<span class="count">（#{data[k]}）</span></a></li>
    #js
    }
    #end
</ul>