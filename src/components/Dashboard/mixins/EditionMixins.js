// 新旧版本切换
import store from '@/store'
export default {
  computed: {
    visible () {
      let res = false
      store.state.app.layout.forEach(item => {
        if (item.id === store.state.app.currentLayoutId) {
          res = item.option.theme.Basic.Edition.edition === 'newEdition'
        }
      })
      return res
    }
  }
}
