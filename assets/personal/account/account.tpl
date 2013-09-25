<div id="account-setting">
    <div class="container"><h3>帐户设置</h3>

            <div class="item">
                <h4>基本信息</h4>
                <table>
                    <tr>
                        <th>头像</th>
                        <td>
                            <div class="upload-avatar">
                                <form target="upload-image" enctype="multipart/form-data" id="upload-image-form" method="post" action="/upload/avatar">
                                <img src="avatar">
                                <div style="width:0;height:0;overflow:hidden"><input type="file" name="file" onchange="this.form.submit()" id="upload-avatar"></div>
                                <input type="hidden" name="callback" value="upload-image-form">
                                <label for="upload-avatar">
                                    <span><b>上传头像<br>80x80</b></span>
                                </label>
                                </form>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>昵称</th>
                        <td><input type="text" name="nick" placeholder="6个汉字以内"></td>
                    </tr>
                    <tr>
                        <th>职业</th>
                        <td>
                            <div class="select">
                                <input type="text" name="job">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="item">
                <h2>密码管理</h2>
                <table>
                    <tr>
                        <th>原密码</th>
                        <td><input name="origin-pwd" type="password"></td>
                    </tr>
                    <tr>
                        <th>新密码</th>
                        <td><input name="new-pwd" type="password"></td>
                    </tr>
                    <tr>
                        <th>确认密码</th>
                        <td><input name="confirm-pwd" type="password"></td>
                    </tr>
                    <tr>
                        <th></th>
                        <td><input class="btn btn-large" value="确认修改"></td>
                    </tr>
                </table>
            </div>
    </div>
</div>