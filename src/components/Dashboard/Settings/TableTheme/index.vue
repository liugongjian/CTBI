<template>
  <div
    v-if="visible"
    class="editor-object-container"
  >
    <el-checkbox v-model="option.show">自定义表格主题</el-checkbox>
    <div :class="{'box-disabled':!option.show}">
      <div class="table-theme">
        <div
          class="table-theme_type"
          @click="handleType('stripe')"
        >
          <div><img
            src="./image/table1.png"
            alt=""
            :class="`${option.active==='stripe'?'active': ''}`"
          ></div>
          <div>斑马线</div>
        </div>
        <div
          class="table-theme_type"
          @click="handleType('border')"
        >
          <div><img
            src="./image/table2.png"
            alt=""
            :class="`${option.active==='border'?'active': ''}`"
          ></div>
          <div>线框</div>
        </div>
      </div>
      <div class="table-theme">
        <div
          class="table-theme_type"
          @click="handleType('simple')"
        >
          <div><img
            src="./image/table3.png"
            alt=""
            :class="`${option.active==='simple'?'active': ''}`"
          ></div>
          <div>简版</div>
        </div>
        <div
          class="table-theme_type"
          @click="handleType('verySimple')"
        >
          <div><img
            src="./image/table4.png"
            alt=""
            :class="`${option.active==='verySimple'?'active': ''}`"
          ></div>
          <div>极简</div>
        </div>
      </div>
      <div v-if="option.active==='simple'"><span>主色系</span></div>
      <el-radio-group
        v-if="option.active==='simple'"
        v-model="option.colorType"
      >
        <el-radio label="themeColor">主题色</el-radio>
        <el-radio label="gray">灰色</el-radio>
        <el-radio label="custom">自定义</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Edition from '@/components/Dashboard/mixins/EditionMixins'

export default {
  name: 'TableTheme',
  mixins: [Edition],
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    'option.colorType': {
      handler (val) {
        store.state.app.layout.forEach(item => {
          if (item.id === store.state.app.currentLayoutId) {
            item.option.theme.DisplayConfig.Color.show = val === 'custom'
          }
        })
      }
    },
    'option.active': {
      handler (val) {
        store.state.app.layout.forEach(item => {
          if (item.id === store.state.app.currentLayoutId) {
            item.option.theme.DisplayConfig.Color.show = val === 'verySimple'
          }
        })
      }
    }
  },
  methods: {
    handleType (val) {
      this.option.active = val
    }
  }
}
</script>

<style>
.table-theme {
  display: flex;
}
.table-theme_type {
  flex: 1;
  text-align: center;
  cursor: pointer;
}
</style>
