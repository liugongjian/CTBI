<template>
  <div class="menu">
    <div>
      <ul>
        <li v-for="item in data" :key="item.value" class="li-wrapper">{{ item.label }}</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  // 定义实现v-modal的属性与事件
  props: {
    data: {
      type: Array,
      default: undefined
    }
  },
  methods: {
    showElement (data) {
      console.log(data)
      this.show = true
    },
    hidden() {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.menu {
  position: absolute;
  top: 200px;
  left: 100px;
}
.li-wrapper{
  font-size: 14px;
  color: #666666;
  background: #fff;
  height: 30px;
  padding: 0 6px;
}
</style>
