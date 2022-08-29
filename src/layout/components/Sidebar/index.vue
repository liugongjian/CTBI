<template>
  <div class="sidebar-container">
    <logo
      v-if="showLogo"
      :collapse="false"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="sidebarStyle.menuBg"
        :text-color="sidebarStyle.menuText"
        :active-text-color="sidebarStyle.menuActiveText"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo.vue'
import sidebarStyle from '@/layout/components/Sidebar/sidebar.scss'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem'
import appRouter from '@/router/app.router'

export default {
  components: { Logo, SidebarItem },
  props: {},
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    sidebarStyle () {
      return sidebarStyle
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    routes () {
      let result = [...appRouter, ...this.$store.state.user.routes]
      const role = this.$store.state.user.userData.role
      // 非superUser 和 admin 用户 无权看 模板列表页
      if (role !== 'superUser' && role !== 'admin') {
        result = result.filter(item => item.name !== 'template')
      }
      return result
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>
