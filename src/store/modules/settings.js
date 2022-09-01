import defaultSettings from '@/config/settings'
import color from '@/styles/settings.scss'

const { showSettings, tagsView, sidebarLogo, layoutStyles, chartsStyles, scaleStyles } = defaultSettings

// localStorage存储字符串信息，需要做转换
const state = {
  showSettings: localStorage.getItem('showSettings') ? localStorage.getItem('showSettings') === 'true' : showSettings,
  theme: localStorage.getItem('theme') ? localStorage.getItem('theme') : color.theme,
  tagsView: localStorage.getItem('tagsView') ? localStorage.getItem('tagsView') === 'true' : tagsView,
  sidebarLogo: localStorage.getItem('sidebarLogo') ? localStorage.getItem('sidebarLogo') === 'true' : sidebarLogo,
  layoutStyles: localStorage.getItem('styles') ? localStorage.getItem('styles') : layoutStyles,
  chartsStyles: localStorage.getItem('chartsStyles') ? localStorage.getItem('chartsStyles') : chartsStyles,
  scaleStyles: scaleStyles
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      localStorage.setItem(key, value)
    }
  }
}

const actions = {
  changeSetting ({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

