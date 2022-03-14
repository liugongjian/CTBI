const state = {
  menuPath: localStorage.getItem('menuPath')
    ? localStorage.getItem('menuPath') : '/home',
  layout: []
}

const mutations = {
  UPDATEMENU: (state, menuPath) => {
    state.menuPath = menuPath
    localStorage.setItem('menuPath', menuPath)
  },
  UPDATELAYOUT: (state, layout) => {
    state.layout = [...layout]
  }
}
const actions = {
  updateMenu ({ commit }, menuPath) {
    commit('UPDATEMENU', menuPath)
  },
  updateLayout ({ commit }, layout) {
    commit('UPDATELAYOUT', layout)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
