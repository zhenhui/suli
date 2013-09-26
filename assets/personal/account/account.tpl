<div id="account-setting">
    <div class="container"><h3>帐户设置</h3>

        <div class="item">
            <h4>基本信息</h4>

            <form target="upload-image" enctype="multipart/form-data" id="upload-image-form" data-callback-id=""
                  method="post" action="/upload/avatar">
                <table>
                    <tr>
                        <th style="vertical-align: top;">头像</th>
                        <td>
                            <div class="upload-avatar">
                                <img id="upload-image-preview">
                                <input type="hidden" name="callback-func-name"/>
                                <input type="hidden" id="upload-avatar-id" name="result-field">

                                <div style="width:0;height:0;overflow:hidden"><input type="file" name="file"
                                                                                     onchange="this.form.submit()"
                                                                                     id="upload-avatar"></div>
                                <label id="upload-avatar-label" for="upload-avatar">
                                    <span><b>上传头像<br>80x80</b></span>
                                </label>
                            </div>
                        </td>
                    </tr>
                </table>
            </form>

        </div>
        <div class="item">
            <h2>密码管理</h2>

            <form action="/admin/user/update/password" method="post" id="admin-user-update-password">
                <table>
                    <tr>
                        <th>原密码</th>
                        <td><input name="origin-pwd" class="text-field text-field-normal" type="password"></td>
                    </tr>
                    <tr>
                        <th>新密码</th>
                        <td><input name="new-pwd" class="text-field text-field-normal" type="password"></td>
                    </tr>
                    <tr>
                        <th>确认密码</th>
                        <td><input name="confirm-pwd" class="text-field text-field-normal" type="password"></td>
                    </tr>
                    <tr>
                        <th></th>
                        <td><input type="submit" class="btn btn-large" value="确认修改"></td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>