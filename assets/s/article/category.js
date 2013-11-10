/**
 * Created by 松松 on 13-11-10.
 */
define(function (require, exports, module) {

    exports.getCategoryResult = function (callback) {

        $.ajax({
            url: '/article/json/category',
            dataType: 'jsonp'
        }).done(function (data) {
                callback(data)
            })
    }

})