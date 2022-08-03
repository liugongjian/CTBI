<template>
  <div
    class="tab-pane-content"
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="基础信息"
        name="1"
      >
        <div
          v-for="(item,name,key) in option['Basic']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['Basic'][name]"
          />
        </div>
      </el-collapse-item>
      <!-- 指标趋势图 -->
      <el-collapse-item
        v-if="option['trendChartConfig']"
        title="趋势图配置"
        name="8"
      >
        <div
          v-for="(item,name,key) in option['trendChartConfig']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['trendChartConfig'][name]"
          />
        </div>
      </el-collapse-item>
      <!-- 指标趋势图 指标块样式配置 -->
      <el-collapse-item
        v-if="option['trendStyleConfig']"
        title="指标块样式配置"
        name="9"
      >
        <div
          v-for="(item,name,key) in option['trendStyleConfig']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['trendStyleConfig'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['ComponentOption']"
        title="图表样式"
        name="2"
      >
        <div
          v-for="(item,name,key) in option['ComponentOption']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['ComponentOption'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['Axis']"
        title="坐标轴"
        name="3"
      >
        <el-tabs v-model="activeName" class="axis-tab">
          <el-tab-pane
            v-for="(item,name,key) in option['Axis']"
            :key="key"
            :label="item.cname"
            :name="key.toString()"
          >
            <component
              :is="name"
              :option="option['Axis'][name]"
            />
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['DisplayConfig']"
        title="展示型配置"
        name="4"
      >
        <div
          v-for="(item,name,key) in option['DisplayConfig']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['DisplayConfig'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['SeriesSetting']"
        title="系列设置"
        name="5"
      >
        <div
          v-for="(item,name,key) in option['SeriesSetting']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['SeriesSetting'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['FunctionalOption']"
        title="功能设置"
        name="6"
      >
        <component
          :is="'FunctionalOption'"
          :option="option['FunctionalOption']"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="option['StyleConfig']"
        title="样式配置"
        name="7"
      >
        <div
          v-for="(item,name,key) in option['StyleConfig']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['StyleConfig'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['TabConfig']"
        title="Tab配置"
        name="8"
      >
        <component
          :is="'TabConfig'"
          :option="option['TabConfig']"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      activeNames: '9',
      activeName: '0'
    }
  },
  watch: {
    'option.ComponentOption.TwisYAxis': {
      handler (val) {
        if (val) {
          if (val.check) {
            const Y1Axis = JSON.parse(JSON.stringify(this.option.Axis.YAxis))
            Y1Axis.cname = '右Y轴'
            this.$set(this.option.Axis, 'Y1Axis', Y1Axis)
          } else {
            if (!val.check && this.option.Axis?.Y1Axis) {
              this.$delete(this.option.Axis, 'Y1Axis')
            }
          }
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__nav-scroll {
  justify-content: center;
}
</style>
