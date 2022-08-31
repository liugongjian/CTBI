const state = {
  // 可视化样式
  visiableStyle: 'funnel-standard' // funnel-standard  funnel-horizontal
}

const mutations = {
  CHANGE_STYLE: (state, style) => {
    state.visiableStyle = style
  }
}

const actions = {
  changeStyle ({ commit }, style) {
    commit('CHANGE_STYLE', style)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
