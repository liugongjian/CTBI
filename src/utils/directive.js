export default function directive (app) {
  // 注册 v-auth 和 v-auth-all 指令 权限判断使用
  // app.directive('auth', {
  //   mounted: (el, binding) => {
  //     if (!auth(binding.value)) {
  //       el.remove()
  //     }
  //   }
  // })
  // app.directive('auth-all', {
  //   mounted: (el, binding) => {
  //     if (!authAll(binding.value)) {
  //       el.remove()
  //     }
  //   }
  // })

  // 拖拽调整高度
  app.directive('dragging', {
    mounted: (el, binding, vnode) => {
      const current = el // 当前元素
      console.log(123)
      // const targetDiv = document.getElementById('scrollbarBox') // 写在此处，浏览器偶尔会报错，可以直接写在下面onmousemove 事件中
      current.onmousedown = function (e) {
        const startY = e.clientY
        current.top = current.offsetTop
        // 鼠标按下
        document.onmousemove = function (e) {
          const targetDiv = document.getElementById('scrollbarBox')
          const endY = e.clientY
          let th = current.top + (endY - startY)
          if (th < 100) {
            th = 100
          }
          targetDiv.style.height = th + 'px'
        }
        document.onmouseup = function (e) {
          document.onmousemove = null
          document.onmouseup = null
        }
        return false
      }
    }
  })
}
