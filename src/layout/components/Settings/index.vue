<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">系统布局配置</h3>

      <div class="drawer-item">
        <span>主题色</span>
        <theme-picker
          style="float: right;height: 26px;margin: -3px 8px 0 0;"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>开启 Tags-View</span>
        <el-switch
          v-model="showTagsView"
          class="drawer-switch"
          @change="setTagsView"
        />
      </div>

      <div class="drawer-item">
        <span>侧边栏 Logo</span>
        <el-switch
          v-model="sidebarLogo"
          class="drawer-switch"
          @change="setSidebarLogo"
        />
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data () {
    return {
      showTagsView: this.$store.state.settings.tagsView,
      sidebarLogo: this.$store.state.settings.sidebarLogo
    }
  },
  methods: {
    themeChange (val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    setTagsView (val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'tagsView',
        value: val
      })
    },
    setSidebarLogo (val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'sidebarLogo',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
