<template>
  <div>
    <el-dropdown class="item" :hide-on-click="false" trigger="click">
      <span class="dropdown-link">
        <svg-icon icon-class="setting" />
      </span>
      <el-dropdown-menu slot="dropdown" class="default-option-dropdown">
        <el-dropdown-item class="setting-all">
          <div class="dropdown-item">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >列展示</el-checkbox>
            <div class="dropdown-item-btn">
              <el-button type="text" @click="reset">重置</el-button>
            </div>
          </div>
        </el-dropdown-item>
        <el-divider />
        <template v-if="isFixedLeft">
          <div class="fixed-title">固定在左侧</div>
        </template>
        <template v-for="item in tableColumns">
          <el-dropdown-item
            v-if="item.fixed === 'left' || item.fixed === true"
            :key="item.prop + 'left'"
          >
            <div class="dropdown-item">
              <!-- <span class="darg-icon">
                <svg-icon icon-class="info-darg"/>
              </span> -->
              <div class="item-wrap">
                <el-checkbox
                  v-model="item.isShow"
                  :label="item.label"
                />
                <div class="dropdown-item-btn">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="不固定"
                    placement="top"
                  >
                    <svg-icon
                      icon-class="vertical-align-middle"
                      @click="handleFixColumn(item, false)"
                    />
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="固定在列尾"
                    placement="top"
                  >
                    <svg-icon
                      icon-class="vertical_align_bottom"
                      @click="handleFixColumn(item, 'right')"
                    />
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-dropdown-item>
        </template>
        <template v-if="isFixedNone">
          <div class="fixed-title">不固定</div>
        </template>
        <template v-for="item in tableColumns">
          <el-dropdown-item
            v-if="item.fixed === false"
            :key="item.prop + 'none'"
          >
            <div class="dropdown-item">
              <!-- <span class="darg-icon">
                <svg-icon icon-class="info-darg"/>
              </span> -->
              <div class="item-wrap">
                <el-checkbox v-model="item.isShow" :label="item.label" />
                <span class="dropdown-item-btn">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="固定在列首"
                    placement="top"
                  >
                    <svg-icon
                      icon-class="vertical_align_top"
                      @click="handleFixColumn(item, 'left')"
                    />
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="固定在列尾"
                    placement="top"
                  >
                    <svg-icon
                      icon-class="vertical_align_bottom"
                      @click="handleFixColumn(item, 'right')"
                    />
                  </el-tooltip>
                </span>
              </div>
            </div>
          </el-dropdown-item>
        </template>
        <template v-if="isFixedRight">
          <div class="fixed-title">固定在右侧</div>
        </template>
        <template v-for="item in tableColumns">
          <el-dropdown-item
            v-if="item.fixed === 'right'"
            :key="item.prop + 'right'"
          >
            <div class="dropdown-item">
              <!-- <span class="darg-icon">
                <svg-icon icon-class="info-darg"/>
              </span> -->
              <div class="item-wrap">
                <el-checkbox
                  v-model="item.isShow"
                  :label="item.label"
                />
                <div class="dropdown-item-btn">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="固定在列首"
                    placement="top"
                  >
                    <svg-icon
                      icon-class="vertical_align_top"
                      @click="handleFixColumn(item, 'left')"
                    />
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="不固定"
                    placement="top"
                  >
                    <svg-icon
                      icon-class="vertical-align-middle"
                      @click="handleFixColumn(item, false)"
                    />
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'ColumnSetting',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    tableColumns: {
      type: Array
    }
  },
  computed: {
    checkAll: {
      get () {
        return this.tableColumns.every(({ isShow }) => isShow)
      },
      set (val) {
        return val
      }
    },
    columnOptions () {
      return this.tableColumns.map(({ prop }) => prop)
    },

    isIndeterminate () {
      return !(
        this.tableColumns.every(({ isShow }) => !isShow) ||
        this.tableColumns.every(({ isShow }) => isShow)
      )
    },
    isFixedLeft () {
      return (
        this.tableColumns.some(
          ({ fixed }) => fixed === 'left' || fixed === true
        ) &&
        !this.tableColumns.every(
          ({ fixed }) => fixed === 'left' || fixed === true
        )
      )
    },
    isFixedRight () {
      return (
        this.tableColumns.some(({ fixed }) => fixed === 'right') &&
        !this.tableColumns.every(({ fixed }) => fixed === 'right')
      )
    },
    isFixedNone () {
      return (
        this.tableColumns.some(({ fixed }) => fixed === false) &&
        !this.tableColumns.every(({ fixed }) => fixed === false)
      )
    }
  },
  methods: {
    reset () {
      this.$emit('reset')
    },
    handleFixColumn (row, fixed) {
      row.fixed = fixed
      this.$emit('changeColumns', row)
    },
    handleCheckAllChange (val) {
      this.tableColumns.forEach((item) => {
        item.isShow = val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.default-option-dropdown {
  ::v-deep .el-divider--horizontal {
    margin: 0;
  }
  .fixed-title {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    padding-left: 24px;
    margin-bottom: 6px;
    margin-top: 6px;
  }
  ::v-deep .el-dropdown-menu__item {
    padding-left: 0;
  }
  .setting-all {
    padding-left: 17px;
    .dropdown-item {
      justify-content: space-between;
      .dropdown-item-btn {
        display: block;
      }
    }
  }
  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .darg-icon {
      padding-right: 6px;
      cursor: move;
    }
    .item-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 178px;
      margin-left: 17px;
      ::v-deep .el-checkbox__label {
        max-width: 90px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: text-bottom;
      }
      .dropdown-item-btn {
        display: none;
        padding: 5px 0;
        .item {
          margin: 0 5px;
        }
      }
    }
    &:hover .dropdown-item-btn {
      display: block;
    }
  }
}
</style>
