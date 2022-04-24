const state = {
  menuPath: localStorage.getItem('menuPath')
    ? localStorage.getItem('menuPath') : '/home',
  layout: [],
  currentLayoutId: '',
  toolList: {}
}

const mutations = {
  UPDATEMENU: (state, menuPath) => {
    state.menuPath = menuPath
    localStorage.setItem('menuPath', menuPath)
  },
  UPDATELAYOUT: (state, layout) => {
    state.layout = [...layout]
  },
  UPDATELAYOUTID: (state, id) => {
    state.currentLayoutId = id
  },
  DELETELAYOUTBYID: (state, id) => {
    if (id && id.length) {
      // 删除layout对应id的组件
      state.layout.splice(
        state.layout.findIndex((item) => item.i === id),
        1
      )
      // 清空currentLayoutId
      state.currentLayoutId = ''
    }
  },
  UPDATETOOLLIST: (state, toolList) => {
    state.toolList = toolList
  }
}
const actions = {
  updateMenu ({ commit }, menuPath) {
    commit('UPDATEMENU', menuPath)
  },
  updateLayout ({ commit }, layout) {
    commit('UPDATELAYOUT', layout)
  },
  updateLayoutId ({ commit }, id) {
    commit('UPDATELAYOUTID', id)
  },
  deleteLayoutById ({ commit }, id) {
    commit('DELETELAYOUTBYID', id)
  },
  updateToolList ({ commit }, toolList) {
    commit('UPDATETOOLLIST', toolList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
