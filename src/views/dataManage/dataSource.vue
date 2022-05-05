<template>
  <div class="data-source">
    <div class="data-source__title">
      <span>数据源</span>
    </div>
    <div class="data-source__content">
      <div class="data-source__header">
        <div class="head-title">数据源</div>
        <div class="head-select">
          <el-dropdown>
            <el-button type="primary">
              +新建数据源
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>MySQL</el-dropdown-item>
              <el-dropdown-item>MongoDB</el-dropdown-item>
              <el-dropdown-item>本地文件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="data-source__list">
        <el-table>
          <div>hah</div>
        </el-table>
      </div>
      <div class="data-file__list">
        <el-table>
          <div>hah</div>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataSourceList, getDataFileList } from '@/api/dataSource'
export default {
  name: 'DataSource',
  data() {
    return {
    }
  },
  mounted() {
    this.getDataSourceL()
    this.getDataFileL()
  },
  methods: {
    async getDataSourceL() {
      await getDataSourceList()
    },
    async getDataFileL() {
      await getDataFileList()
    }
  }
}
</script>

<style lang="scss" scoped>
.data-source {
  height: 100%;
  width: 100%;

  &__title {
    height: 20px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 20px;
    font-weight: 500;
  }

  &__header {
    display: flex;
    justify-content: space-between
  }

  &__content {
    position: relative;
    background: #fff;
    padding: 16px;
    margin-top: 16px;
    height: calc(100vh - 50px);
  }
}
</style>
