<template>
  <div class="wrapper" @click="destroyCom">
    <div v-for="(item, index) in menuData" :key="index">
      <transition name="menu-show">
        <div v-show="show">
          <c-menu :data="item" :place="index" :position="menuPositions[index]" @select="handleSelect" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import CMenu from './menu.vue'
export default {
  components: { CMenu },
  data () {
    return {
      show: false,
      value: [],
      menuData: [],
      menuPositions: []
    }
  },
  methods: {
    showElement (data) {
      console.log(data)
      this.show = true
      const { position, options } = data
      this.menuData = [options]
      this.menuPositions = [{ top: (position.y - 10) + 'px', left: (position.x + position.width - 10) + 'px' }]
    },
    hidden() {
      this.show = false
    },
    registerParent(parent) {
      this.parent = parent
      console.log(parent)
    },
    destroyCom() {
      this.parent.destroyMenu()
    },
    handleSelect(e) {
      console.log(e)
      const { data, place, position, index } = e
      if (data.children && data.children.length) {
        this.menuData = [...this.menuData.slice(0, place + 1), data.children]
        this.menuPositions = [...this.menuPositions.slice(0, place + 1), { top: (position.y + index * 30) + 'px', left: (position.x + position.width - 5) + 'px' }]
      } else {
        this.parent.hadChoose(data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.menu-show-enter-active {
  transition: all .5s ease;
}
.menu-show-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.menu-show-enter, .menu-show-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: transparent;
  z-index: 9999;
}
.field-type {
  width: 138px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #dddddd;
  line-height: 32px;
  display: flex;
  justify-content: space-between;
  padding: 0px 12px;
}
</style>
