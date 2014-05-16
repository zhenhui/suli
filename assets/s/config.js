/**
 * Created by songsong on 12/9/13.
 */


KISSY.config({
    modules: {
        'sizzle': { alias: ['node'] },
        'ajax': { alias: ['io'] },
        'calendar': { alias: ['gallery/calendar-deprecated/1.0/']  },
        'datalazyload': {  alias: ['gallery/datalazyload/1.0/'] },
        'switchable': { alias: ['gallery/switchable/1.3.1/'] },
        'imagezoom': { alias: ['gallery/imagezoom/1.0/'] },
        'waterfall': { alias: ['gallery/waterfall/1.0/'] },
        'flash': { alias: ['gallery/flash/1.0/'] }
    }
});
seajs.config({
    base :assetsCDN+"/s/sea-modules/",
    vars: {
        locale: 'zh-cn'
    },
    paths:{
        s : assetsCDN+"/s",
        sea : assetsCDN+"/s/sea-modules"
    },
    map:[
        [/(.*\.(css|js))(?:.*)$/i, "$1?201312091350.$2"]
    ],
    alias: {
        template: 'sea/xiongsongsong/template/1.1.0/template',
        'popup':'sea/arale/popup/1.1.5/popup',
        'position':'sea/arale/position/1.0.1/position',
        '$':'s/global/jquery.js'
    }
});
