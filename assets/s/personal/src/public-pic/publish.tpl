<div id="upload-pic">
    <div class="container"><h3>图床，仅供内部或首页使用，不对外开放</h3>

        <form target="upload-image" enctype="multipart/form-data" id="upload-image-form" data-callback-id=""
              method="post" action="/upload/tuchuang">
            <input type="hidden" name="_csrf" value="#{window._csrf_token_}" />
            <input type="file" class="btn btn-large" name="file">
            <input type="hidden" name="callback-func-name"/>
            <input type="hidden" id="upload-avatar-id" name="result-field">
            <input type="submit" class="btn btn-large" value="开始上传图像（500k以内）">
        </form>
        <h3>List Ctrl+C copy to ClipBoard</h3>

        <div class="list">
            <ul class="J-image" id="show-tuchuang-preview-trigger"></ul>
        </div>
    </div>
</div>
