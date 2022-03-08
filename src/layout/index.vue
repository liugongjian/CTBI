<template>
  <el-container>
    <el-aside style="width: auto;">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header :style="{height: (showTagsView? '85px': '50px') }">
        <Navbar />
        <tags-view v-if="showTagsView" />
      </el-header>
      <el-main>
        <AppMain />
      </el-main>
    </el-container>
    <!-- 设定窗口 -->
    <RightPanel>
      <Settings />
    </RightPanel>
  </el-container>
</template>

<script>
import { AppMain, Navbar, Sidebar, RightPanel, Settings, TagsView } from '@/layout/components/index'

export default {
  components: { AppMain, Navbar, Sidebar, RightPanel, Settings, TagsView },
  computed: {
    showTagsView () {
      return this.$store.state.settings.tagsView
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  padding: 0px;
}
</style>
