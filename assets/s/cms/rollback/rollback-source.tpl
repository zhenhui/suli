<div style="padding: 12px 0">
    <div style="height: 500px;overflow: auto;">
        <table class="table table-condensed table-hover table-striped">
            <tr>
                <th width="50%">页面名称</th>
                <th width="20%">日期</th>
                <th width="15%">用户</th>
                <th width="15%">操作</th>
            </tr>
            #each(item in docs)
            #run var date=new Date(item.ts)
            <tr>
                <td>#{item.page_name}</td>
                <td><span class="label label-info">#{date.getFullYear()}-#{date.getMonth()+1}-#{date.getDate()} #{date.getHours()}:#{date.getMinutes()}:#{date.getSeconds()}</span>
                </td>
                <td>#{item.owner_name}</td>
                <td><a class="btn btn-primary btn-xs J-rollback-version" data-version-id="#{item._id}">恢复</a></td>
            </tr>
            #end
        </table>
    </div>
</div>