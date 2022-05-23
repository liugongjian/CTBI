export default function directive (app) {
  app.directive('resize-width', {
    bind: (el, binding, vnode) => {
      if (el) {
        const element = el
        const max = binding.value.max
        const min = binding.value.min
        const touch = { lastTime: 0, interval: 300, startX: 0 }
        let move = 0
        // move 是鼠标移动的距离，min和max是可拖动范围
        const mousemove_ = (e) => {
          if (!touch.init) return
          move = e.pageX - touch.startX
          element.style.width =
            touch.width + move + 'px'
          if (touch.width + move > max) {
            element.style.width = max + 'px'
          }
          if (touch.width + move < min) {
            element.style.width = min + 'px'
          }
        }

        const mouseup_ = () => {
          if (!touch.init) return
          touch.init = false
          document.removeEventListener('mousemove', mousemove_)
          document.removeEventListener('mouseup', mouseup_)
        }

        el.style.position = 'relative'
        const dom = document.createElement('DIV')
        dom.style.height = '100%'
        dom.style.width = '3px'
        dom.style.position = 'absolute'
        dom.style.top = '0px'
        dom.style.right = '0px'
        dom.style.cursor = 'e-resize'
        dom.style.backgroundColor = 'transparent'
        dom.style.userSelect = 'none'
        dom.style.touchAction = 'none'
        dom.addEventListener('mousedown', function (e) {
          const now = +new Date()
          if (now - touch.lastTime < touch.interval) {
            return (touch.init = false)
          }
          touch.init = true
          touch.startX = e.pageX
          touch.width = el.offsetWidth
          document.addEventListener(
            'mousemove', mousemove_,
            { passive: false }
          )
          document.addEventListener('mouseup', mouseup_)
        })

        el.appendChild(dom)
      }
    }
  })
}
