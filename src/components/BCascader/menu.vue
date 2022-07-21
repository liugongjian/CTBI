<template>
  <div class="menu" :style="position">
    <div :id="'menu-outer' + place" class="outer">
      <div v-for="item in data" :key="item.value" class="li-wrapper" @click.stop="(e) => doSomething(item, e)">
        <p>{{ item.label }}</p>
        <div v-if="item.children && item.children.length " class="arrow"> <i class="el-icon-arrow-right" /> </div>
      </div>
    </div>
  </div></template>

<script>

export default {
  props: {
    data: {
      type: Array,
      default: undefined
    },
    place: {
      type: Number,
      default: 0
    },
    position: {
      type: Object,
      default: null
    }
  },
  methods: {
    showElement (data) {
      console.log(data)
      this.show = true
    },
    hidden() {
      this.show = false
    },
    doSomething(data, e) {
      console.log(e)
      const position = this.test()
      console.log(position)
      this.$emit('select', { data, place: this.place, position })
    },
    test() {
      const tabs = document.getElementById('menu-outer' + this.place)
      return tabs.getBoundingClientRect()
      // const rects = []
      // if (tabs.length > 0) {
      //   Array.from(tabs).forEach(tab => {
      //     rects.push(tab.getBoundingClientRect())
      //   })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.menu {
  position: absolute;
}
.outer{
  border-radius: 3px;
  padding: 8px 0px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 1px 1px 1px rgba(0,0,0,0.1);
}
.li-wrapper{
  font-size: 14px;
  color: #666666;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 10px;
  .arrow{
    margin-left: 5px;
  }
  &:hover{
    background: rgba(0,0,0,0.1);
  }
}
</style>
