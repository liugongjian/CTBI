<template>
  <div>
    <div class="page-view-wrapper">
      <!-- <div class="router-name">
        <slot name="leftContent">
          {{ routerName }}
        </slot>
      </div> -->
      <div class="right-content">
        <slot name="rightContent" />
      </div>
    </div>
    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageView',
  computed: {
    routerName () {
      return this.$route.meta.title || ''
    }
  }
}
</script>
<style lang="scss" scoped>
.page-view-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-content {
  background-color: #fff;
  min-height: calc(100vh - 120px);
  padding: 16px;
}
.router-name {
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
}
</style>
