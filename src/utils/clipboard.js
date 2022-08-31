import Vue from 'vue'
import Clipboard from 'clipboard'

export function clipboardSuccess () {
  Vue.prototype.$message({
    message: '复制成功',
    type: 'success',
    duration: 1500
  })
}

function clipboardError () {
  Vue.prototype.$message({
    message: '复制失败',
    type: 'error'
  })
}

export default function handleClipboard (text, event, success, error) {
  const clipboard = new Clipboard(event.target.id, {
    text: () => text
  })
  if (success && typeof success === 'function') {
    clipboard.on('success', () => {
      success()
      clipboard.destroy()
    })
  } else {
    clipboard.on('success', () => {
      clipboardSuccess()
      clipboard.destroy()
    })
  }
  if (error && typeof error === 'function') {
    clipboard.on('success', () => {
      error()
      clipboard.destroy()
    })
  } else {
    clipboard.on('error', () => {
      clipboardError()
      clipboard.destroy()
    })
  }

  clipboard.onClick(event)
}
