<template>
  <div id="app">
    <div class="sql-box">
      <SqlEditor
        ref="sqleditor"
        :value="basicInfoForm.sqlMain"
        @changeTextarea="changeTextarea($event)"
      />
    </div>
    <el-button
      type="primary"
      size="small"
      class="sql-btn"
      @click="formaterSql(basicInfoForm.sqlMain)"
    >格式化sql</el-button>
  </div>
</template>

<script>
// import sqlFormatter from "./util/util";
import { format } from 'sql-formatter'
import SqlEditor from '../SqlEditor/index.vue'

export default {
  name: 'Editor',
  components: {
    SqlEditor
  },
  data () {
    return {
      basicInfoForm: {
        sqlMain: ''
      }
    }
  },
  methods: {
    // 拿到sql编辑器内容
    changeTextarea (val) {
      this.$set(this.basicInfoForm, 'sqlMain', val)
    },
    // 格式化sql
    formaterSql (val) {
      const dom = this.$refs.sqleditor
      dom.editor.setValue(format(this.basicInfoForm.sqlMain))
    }
  }
}
</script>

<style scoped>
.sql-box {
  width: 80%;
  border: 1px solid #ddd;
}
</style>
