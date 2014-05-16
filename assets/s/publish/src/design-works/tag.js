/**
 * Created by 松松 on 13-12-4.
 */

define(function (require, exports, module) {

    var S = KISSY

    //tag总容器
    var $tag = $('#tag')

    //tag输入框
    var $tagInput = $('#tag-field')

    //包裹tag的容器
    var $tagControl = $("#tag-control")

    //存放tag以提交给服务器
    var $tagValue = $('#tag-value')

    require.async('/go/design-works/tag?r=' + S.now() + '&callback=define', function (data) {
        var str = S.map(data.replace(/\s/gmi, '').split(/[，,]/), function (tag) {
            return '<option value="' + tag + '"></option>'
        })
        $('#tagList').html(str)
    })

    var tagCache = {}

    var re = /^[\u4e00-\u9fa5A-Za-z0-9]{2,}$/

    $tagInput.on('keydown', function (ev) {
        setTimeout(function () {
            var val = $tagInput.val()
            if (val.replace(/\s/g, '').length > 0 && (val.substring(val.length - 3) === '   ' || ev.type === 'blur')) {
                //检测标签是否符合规则
                if (re.test(S.trim(val))) {
                    updateTag($tagInput.val())
                    $tagInput.val('')
                    console.log(val + '符合规则')
                } else {
                    console.log(val + '不符合规则')
                }
            }
        }, 0)
    })

    //当失去焦点
    $tagInput.on('blur', function (ev) {
        var val = S.trim($tagInput.val())
        S.each(val.split(' '), function (tag) {
            if (re.test(tag)) {
                updateTag(tag)
            }
        })
        $tagInput.val('')
    })

    //删除标签
    $tagControl.on('click', '.J-delete', function (ev) {
        ev.preventDefault()
        var text = $(ev.currentTarget).data('text')
        delete tagCache[text]
        $(ev.currentTarget).parents('.J-tag').remove()
        $tagValue.val(S.keys(tagCache).join(' '))
    })

    $tag.on('click', function (ev) {
        if (ev.target === $tag[0]) $tagInput.focus()
    })


    function updateTag(val) {
        //对于已经存在的tag，予以删除
        val = S.trim(val)
        if (!re.test(val)) return
        if (tagCache[val]) return
        tagCache[val] = val
        $('<a class="tag J-tag">' + val + '<span class="delete J-delete" data-text="' + val + '">&times;</span></a>').appendTo($tagControl)

        $tagValue.val(S.keys(tagCache).join(' '))

    }

    exports.tag = tagCache

})
