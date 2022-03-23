const state = {
  menuPath: localStorage.getItem('menuPath')
    ? localStorage.getItem('menuPath') : '/home',
  layout: [],
  currentLayoutId: ''
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
    console.log(state.currentLayoutId)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
