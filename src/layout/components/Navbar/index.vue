<template>
  <div class="navbar">
    <div class="right-menu">
      <!-- 用户名称及其下拉框 -->
      <el-dropdown class="avatar-container">
        <div class="d-f f-c-c c-p c-fff">
          <div class="m-r-10">{{ name }}</div>
          <div><i class="el-icon-caret-bottom" /></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="showRightPanel">
            <span style="display:block;">设 置</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">注 销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 背景图片 -->
      <img
        src="@/assets/bg_head_r.svg"
        class="bg-head-r"
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showPanel: true
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    showRightPanel () {
      this.$bus.$emit('showRightPanel')
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #001629;
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: $bg;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .avatar-container {
      z-index: 2;
      padding: 0 20px;
    }
  }

  .bg-head-r {
    position: absolute;
    right: 0px;
    z-index: 1;
  }
}
</style>
