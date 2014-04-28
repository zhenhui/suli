jQuery(function(){
  jQuery('#J-design-works-list').on('mouseenter mouseleave', 'li', function (ev) {
      var $target = $(ev.currentTarget)
      if (ev.type === 'mouseenter') {
          $('<div class="J-up-tv" style="position: absolute;right:10px;top:10px;z-index:99;width:80px;"><button class="btn J-up">上电视</button><button class="btn J-stop">停播这个</button><button class="btn J-stop-all">停播所有</button></div>').appendTo($target)
      } else {
          $target.find('.J-up-tv').remove()
      }
  }).on('click', '.J-up', function (ev) {
      var id = $(ev.currentTarget).parents('li').find('a.link').attr('href').match(/[a-z0-9]{24}/)[0]
      $.ajax({
          url: '/design-works/up-tv',
          data: {
              tv: true,
              id: id
          }, success: function (data) {
              if (data && data.status > 0) {
                  alert('操作成功')
              } else {
                  alert('操作失败')
              }
          }
      })
  }).on('click', '.J-stop', function (ev) {
      var id = $(ev.currentTarget).parents('li').find('a.link').attr('href').match(/[a-z0-9]{24}/)[0]
      $.ajax({
          url: '/design-works/up-tv',
          data: {
              tv: false,
              id: id
          }, success: function (data) {
              if (data && data.status > 0) {
                  alert('操作成功')
              } else {
                  alert('操作失败')
              }
          }
      })
  }).on('click', '.J-stop-all', function (ev) {
      if (confirm('确认停播所有的作品？\r\n之后你要重新选择。')) {
          $.ajax({
              url: '/design-works/up-tv/delete-all'
          })
      }
  })
})
