<template>
  <span id="bi-cascader" class="bi-cas" @click="showClick"><slot /></span>
</template>

<script>

import CMenu from './menuWrapper.vue'
import Vue from 'vue'

export default {
  name: 'BCascader',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    onChoose: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    console.log(123)
  },
  methods: {
    showClick (e) {
      this.show = !this.show
      console.log(e)
      const tabs = document.getElementById('bi-cascader')
      const position = tabs.getBoundingClientRect()
      console.log(position)
      setTimeout(() => { this.insert(position) }, 100)
    },
    insert(position) {
      if (this.menuCom) {
        this.menuCom.hidden('12324356')
        return
      }
      const MenuConstructor = Vue.extend(CMenu)
      const instance = this.menuCom = new MenuConstructor({ propsData: { show: this.show } }).$mount()
      console.log(instance)
      document.body.appendChild(instance.$el)
      this.menuCom.showElement({ position, options: this.options })
      this.menuCom.registerParent(this)
      // instance.$mount('#container')
    },
    destroyMenu() {
      this.menuCom.$el.remove()
      this.menuCom.$destroy()
      this.menuCom = null
    },
    hadChoose(data) {
      this.$emit('onChoose', data)
      this.destroyMenu()
      console.log(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.bi-cas{
  display: inline-block;
  background: blue;
}

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

.field-active {
  color: #fb9c5d;
}

::v-deep .popper__arrow {
  display: none !important;
}
.el-popper {
  margin-top: 0px !important;
  box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
  border-radius: 2px;
}
</style>
