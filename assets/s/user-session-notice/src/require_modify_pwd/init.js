/**
 * Created by xiongsongsong on 12/6/13.
 */

define(function (require, exports, module) {

    var tpl = require('./init.tpl')
    require('./tpl.css')
    var div = document.getElementsByTagName('div')[0]
    $(div).before($(tpl))

})