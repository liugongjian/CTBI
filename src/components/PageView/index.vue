<template>
  <div class="light-bg">
    <div class="page-view-warpper">
      <div class="router-name">
        <slot name="leftContent">
          {{ routerName }}
        </slot>
      </div>
      <div class="right-content">
        <slot name="rightContent" />
      </div>
    </div>
    <div class="main-page">
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
.page-view-warpper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
}
.light-bg {
  background-color: #f1f5f8;
  // padding: 20px;
}
.router-name {
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
}
</style>
