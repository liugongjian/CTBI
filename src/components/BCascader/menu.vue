<template>
  <div class="menu" :style="position">
    <div :id="'menu-outer' + place" class="outer">
      <div v-for="(item, index) in data" :key="item.value" class="li-wrapper" @click.stop="(e) => doSomething(item, index, e)">
        <div v-if="showIcon" class="icon-wrapper">
          <svg-icon
            :icon-class="item.icon"
            style="font-size: 16px;"
          />
        </div>
        <p>{{ item.label }}</p>
        <div v-if="item.children && item.children.length " class="arrow"> <i class="el-icon-arrow-right" /> </div>
      </div>
    </div>
    <div class="trial" />
  </div>
</template>

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
  computed: {
    showIcon() {
      return this.data.some(item => item.icon)
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
    doSomething(data, index, e) {
      console.log(e)
      const position = this.test()
      console.log(position)
      this.$emit('select', { data, place: this.place, position, index })
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
.trial {
  width: 0;
  height: 0;
}
.trial{
    width: 0;
    height: 0;
    border-right: 8px solid rgba(0,0,0,0.1);
    border-top: 8px solid transparent;
    border-bottom:8px solid transparent;
    position: absolute;
    top: 16px;
    left:-7px;
}
.trial::after{
    content: "";
    position:absolute;
    top: -6px;
    right: -8px;
    width: 0;
    height: 0;
    border-right: 6px solid #fff;
    border-top: 6px solid transparent;
    border-bottom:6px solid transparent;
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
  min-width: 60px;
  .arrow{
    margin-left: 5px;
  }
  &:hover{
    background: rgba(240, 145, 75, 0.15);

  }
  .icon-wrapper{
    width: 20px;
    height: 30px;
    line-height: 30px;
  }
}
</style>
