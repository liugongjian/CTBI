/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:48:42
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-24 09:08:06
 * @Description:
 */
const getters = {
  menuPath: state => state.app.menuPath,
  token: state => state.user.token,
  name: state => state.user.userData.userName,
  role: state => state.user.role,
  routes: state => state.user.routes,
  showSettings: state => state.settings.showSettings,
  tagsView: state => state.settings.tagsView,
  visiableStyle: state => state.funnel.visiableStyle,
  currentLayoutId: state => state.app.currentLayoutId
}
export default getters
