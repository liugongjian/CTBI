const getters = {
  menuPath: state => state.app.menuPath,
  token: state => state.user.token,
  name: state => state.user.name,
  routes: state => state.user.routes,
  showSettings: state => state.settings.showSettings,
  tagsView: state => state.settings.tagsView
}
export default getters
