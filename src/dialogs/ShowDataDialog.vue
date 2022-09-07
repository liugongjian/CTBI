<template>
  <el-dialog
    title="查看数据"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
  >
    <div class="main-table">
      <el-table :data="data">
        <template v-for="(item, index) in columns">
          <el-table-column
            :key="index"
            show-overflow-tooltip
            :label="item.name"
            :prop="item.name"
          />
        </template>
      </el-table>
    </div>
    <span slot="footer">
      <el-button @click="closeSilence()">关 闭</el-button>
      <el-button
        type="primary"
        @click="close()"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { getDataSetData } from '@/api/dataSet'
import { getCurrentLayout, isEmpty, getQueryParams } from '@/utils/optionUtils'

export default {
  name: 'ShowDataDialog',
  mixins: [dialogMixin],
  data () {
    return {
      data: '',
      columns: [],
      loading: false
    }
  },
  mounted () {
    this.showData()
  },
  methods: {
    async showData () {
      const currentLayout = getCurrentLayout()
      if (isEmpty(currentLayout)) {
        return
      }
      this.loading = true
      const params = getQueryParams()
      try {
        const body = { query: params.query }
        const dataSetId = params.dataSetId
        const res = await getDataSetData(dataSetId, body)
        const { result: { data, columns } } = res
        this.data = data
        this.columns = columns
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  white-space: break-spaces;
}

.main-table {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
