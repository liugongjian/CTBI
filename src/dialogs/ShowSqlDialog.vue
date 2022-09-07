<template>
  <el-dialog
    title="查看SQL"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
  >
    <span v-loading="loading">{{ sql }}</span>
    <span slot="footer">
      <el-button
        type="primary"
        @click="copyRight($event)"
      >一键复制</el-button>
      <el-button @click="closeSilence()">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { getDataSetData } from '@/api/dataSet'
import { format } from 'sql-formatter'
import Clipboard from '@/utils/clipboard.js'
import { getCurrentLayout, isEmpty, getQueryParams } from '@/utils/optionUtils'

export default {
  name: 'ShowSqlDialog',
  mixins: [dialogMixin],
  data () {
    return {
      sql: '',
      loading: false
    }
  },
  mounted () {
    this.showSql()
  },
  methods: {
    async showSql () {
      const currentLayout = getCurrentLayout()
      if (isEmpty(currentLayout)) {
        return
      }
      this.loading = true
      const params = getQueryParams(100)
      try {
        const body = { query: params.query }
        const dataSetId = params.dataSetId
        const res = await getDataSetData(dataSetId, body)
        const { execInfo: { sqlText } } = res
        this.sql = format(sqlText).replaceAll('$ ', '$').replaceAll('{ ', '{').replaceAll(' }', '}')
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    copyRight (event) {
      Clipboard(this.sql, event)
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  white-space: break-spaces;
  line-height: 26px;
}
</style>
