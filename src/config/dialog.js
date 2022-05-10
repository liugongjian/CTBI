// 弹窗组件共有化
// 引入
// import initDialogs from '@/config/dialog'
// initDialogs(Vue)
// 使用范例
// this.$dialog.show('TestDidalog', { msg: '由父组件传递的信息' }, async (ret) => {
//   const res = await searchBy()
// })

const dialogs = require.context('@/dialogs', true, /.vue$/)
export const initDialogs = (Vue) => {
  let instance
  Vue.prototype.$dialog = {
    show: function (dialog, data = {}, callback = undefined) {
      const d = Object.assign({ dialogVisible: true, callback: callback }, JSON.parse(JSON.stringify(data)))
      let Contructor
      if (typeof dialog === 'string') {
        // 组件实例
        const fileKey = dialogs.keys().find(key => {
          if (dialogs(key).default.name === dialog) {
            return dialogs(key)
          }
        })
        const reqCom = dialogs(fileKey).default
        Contructor = Vue.extend(reqCom)
      } else {
        Contructor = Vue.extend(dialog)
      }
      instance = new Contructor({
        data: d
      }).$mount() // 渲染组件
      // 注意，需要将组价挂载到body上，因为在切换组件时，提示框还有延迟，不会立刻消失
      document.body.querySelector('#main-page').appendChild(instance.$el)
    },
    close: function () {
      if (instance) {
        instance.distroy()
      }
    }
  }
}

export default (Vue) => {
  initDialogs(Vue)
}
