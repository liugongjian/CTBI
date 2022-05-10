<template>
  <div class="edit-wrap">
    <!-- header -->
    <div class="edit-wrap-header">
      <div>
        <i
          class="el-icon-arrow-left h-c-p m-r-8"
          @click="$router.go(-1)"
        />
        <span>{{ dataInfo.displayName || '未命名' }}</span>
      </div>
      <div class="edit-wrap-header-r">
        <el-button
          type="primary"
          @click="showSaveDialog"
        >保存</el-button>
      </div>
    </div>

    <!-- main -->
    <div>
      <!-- 运行记录 -->
      <runner
        v-show="showRunner"
        ref="runner"
      />
      <!-- 数据预览 -->
      <resetter
        v-show="!showRunner"
        ref="resetter"
      />
    </div>

  </div>
</template>

<script>
import Runner from '@/views/dataManage/dataSet/dataSetEdit/Runner'
import Resetter from '@/views/dataManage/dataSet/dataSetEdit/Resetter'
import { getDataSetsInfo } from '@/api/dataSet'
export default {
  components: { Runner, Resetter },
  props: {},
  data () {
    return {
      dataInfo: {
        _id: '',
        displayName: ''
      },
      // 展示预览 & 运行记录
      showRunner: true
    }
  },
  computed: {},
  watch: {
    dataInfo: {
      handler (n, o) {
        console.log('dataInfo改变', n)
      }
    }
  },
  created () {
    const data = this.$route.query
    if (data._id) {
      this.getDetail()
    }
  },
  mounted () { },
  methods: {
    // 获取数据集详情
    async getDetail () {
      const result = await getDataSetsInfo(this.$route.query._id)
      Object.assign(this.dataInfo, result)
      this.$refs.runner.setDataInfo(this.dataInfo)
    },
    // 打开保存窗口
    showSaveDialog () {
      this.$dialog.show('SaveDataSetDialog', { dataInfo: this.dataInfo }, () => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-wrap {
  margin: -20px;
  &-header {
    height: 50px;
    border-bottom: 1px solid #ccc;
    color: #fff;
    box-sizing: border-box;
    background: #2d303b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px;
  }
}
</style>
