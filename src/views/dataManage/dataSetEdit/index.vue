<template>
  <div class="data-set-edit-wrap">
    <!-- header -->
    <div class="data-set-edit-wrap-header"></div>

    <!-- main -->
    <div class="data-set-edit-wrap-main">

      <!-- side -->
      <div class="data-set-edit-wrap-main-side" :class="{ 'data-set-edit-wrap-main-side-shrinked': isShrink }">
        <div class="data-set-edit-wrap-main-side-btn" @click="isShrink = !isShrink"></div>

        <!-- top -->
        <div class="side-top">
          <div v-if="isEdit" class="side-top-main">
            <div><span>当前数据源</span></div>
            <div><span></span></div>
          </div>
          <div v-else class="side-top-main">
            <div><span>选择数据源</span></div>
            <div>
              <el-select v-model="selectedDataSource" placeholder="请选择">
                <el-option
                  v-for="item in dataSourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- bottom -->
        <div class="side-bottom">
          <el-tabs v-model="activedTag">
            <el-tab-pane label="数据表" name="first">
              <div v-for="(table, i) in dataTables" :key="i" class="side-bottom-main">
                <div><span>{{ table.name }}</span></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- content -->
      <div class="data-set-edit-wrap-main-content">
        <!-- top -->
        <div class="sql-edit">
          <EditSql />
        </div>

        <!-- bottom -->
        <div class="result-preview"></div>
      </div>
    </div>
  </div>
</template>

<script>
import EditSql from './components/editSql/index.vue'
export default {
  name: 'DataSetEdit',
  components: {
    EditSql
  },
  data () {
    return {
      isEdit: false,
      isShrink: false,
      selectedDataSource: '',
      dataSourceOptions: [],
      activedTag: 'first',
      dataTables: [
        { name: 'cmswing_action' },
        { name: 'cmswing_action' },
        { name: 'cmswing_action' },
        { name: 'cmswing_action' },
        { name: 'cmswing_action' }
      ]
    }
  },
  methods: {
    init () {}
  }
}
</script>

<style lang="scss" scoped>
.data-set-edit-wrap {
  margin: -20px;
  &-header {
    height: 50px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  &-main {
    display: flex;
    min-height: calc(100vh - 100px);
    box-sizing: border-box;
    background: #fff;
    &-side {
      width: 250px;
      border-right: 1px solid #ccc;
      position: relative;
      &-shrinked {
        left: -250px;
      }
      &-btn {
        width: 10px;
        height: 50px;
        background: red;
        position: absolute;
        left: 250px;
        top: 100px;
        cursor: pointer;
      }
    }
    &-content {
      flex: 1;
    }
  }
}

.side-top {
  height: 100px;
  padding: 20px 12px;
  &-main > div:nth-child(1) {
    margin-bottom: 8px;
  }
}

.side-bottom {
  &-main {
    padding: 0 20px;
  }

  ::v-deep .el-tabs__nav-scroll {
    margin-left: 12px;
  }

  &-main > div {
    margin-bottom: 8px;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
  }
}

.sql-edit {
  min-height: 300px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
</style>
