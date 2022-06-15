<template>
  <div
    v-if="visible"
    class="editor-object-container"
  >
    <el-checkbox v-model="option.show" style="margin-bottom: 12px">自定义表格主题</el-checkbox>
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
          <div class="editor-item-title" style="margin-right: 0px">斑马线</div>
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
          <div class="editor-item-title" style="margin-right: 0px">线框</div>
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
          <div class="editor-item-title" style="margin-right: 0px">简版</div>
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
          <div class="editor-item-title" style="margin-right: 0px">极简</div>
        </div>
      </div>
      <div v-if="option.active!=='verySimple'">
        <div class="editor-item-title">主色系</div>
        <div class="editor-item-container">
          <el-radio-group
            v-model="option.colorType"
          >
            <el-radio label="themeColor">主题色</el-radio>
            <el-radio label="gray">灰色</el-radio>
            <el-radio label="custom">自定义</el-radio>
          </el-radio-group>
        </div>
      </div>

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
    }
  },
  methods: {
    handleType (val) {
      this.option.active = val
    }
  }
}
</script>

<style lang="scss" scoped>
.table-theme {
  display: flex;
  margin-bottom: 12px;
  .table-theme_type {
    flex: 1;
    text-align: center;
    cursor: pointer;
    img{
      border: 1px solid transparent;
    }
    img:hover {
      border: 1px solid #616571;
    }
    .active {
      border: 1px solid  #fa8334 !important;
    }
  }
}

</style>
