<template>
  <div class="edit-sql-wrap">
    <SqlEditor
      ref="sqleditor"
      :value="basicInfoForm.sqlMain"
      @changeTextarea="changeTextarea($event)"
    />
  </div>
</template>

<script>
import SqlEditor from '@/components/SqlEditor/index.vue'
import { format } from 'sql-formatter'
export default {
  name: 'EditSql',
  components: {
    SqlEditor
  },
  props: {
    sqlStatement: {
      type: String,
      default: ''
    }
  },
  watch: {
    sqlStatement: function(newVal, oldVal) {
      this.basicInfoForm.sqlMain = newVal
    }
  },
  data () {
    return {
      basicInfoForm: {
        sqlMain: this.sqlStatement
      }
    }
  },
  methods: {
    // 拿到sql编辑器内容
    changeTextarea (val) {
      this.$set(this.basicInfoForm, 'sqlMain', val)
      this.$emit('sqlStatementChange', val)
    },
    // 格式化sql
    formaterSql (val) {
      const dom = this.$refs.sqleditor
      dom.editor.setValue(format(this.basicInfoForm.sqlMain))
    }
  }
}
</script>

<style>
</style>
