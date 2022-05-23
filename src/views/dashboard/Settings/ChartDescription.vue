<template>
  <div v-if="chartName==='DashboardChart'" class="detail">
    <h2>仪表盘</h2>
    <h3>指针角度只能取1个度量</h3>
    <p>仪表盘可清晰地展示出某个指标值所在的范围。</p>
  </div>
  <div v-else-if="chartName==='KanBanSubregion'" class="detail">
    <h2>指标看板</h2>
    <h3>看板标签最多取1个维度;看板指标最少取1个，最多取10个度量。</h3>
    <p>指标看板可用来展示数据在每一个阶段的变化情况。</p>
  </div>
  <div v-else-if="chartName==='KanBanSummary'" class="detail">
    <h2>指标趋势图</h2>
    <h3>看板指标可以取多个指标，趋势只能取时间维度</h3>
    <p>指标卡趋势图用来表示多个指标一段时间内的变化，指标卡默认展示已有数据的最新一条。</p>
  </div>
  <div v-else-if="chartName==='ProgressChart'" class="detail">
    <h2>进度条</h2>
    <h3>选择度量，最多5个</h3>
    <p>与仪表盘类似，进度条可用来展示某个指标的完成进度。</p>
  </div>
  <div v-else-if="chartName==='RadarChart'" class="detail">
    <h2>雷达图</h2>
    <h3>支持2种数据配置</h3>
    <p>第一种，维度作为分支标签，把维度值作为分支节点，用来展示度量之间的面积分布;</p>
    <p>第二种，度量作为分支标签，把度量作为分支节点，用来展示维度值之间的面积分布</p>
    <p>雷达图可用来综合分析指标的分布情况。</p>
  </div>
  <div v-else-if="chartName==='TrendChart'" class="detail">
    <h2>指标趋势图</h2>
    <h3>看板指标可以取多个指标，趋势只能取时间维度</h3>
    <p>指标卡趋势图用来表示多个指标一段时间内的变化，指标卡默认展示已有数据的最新一条。</p>
  </div>
  <div v-else-if="chartName==='WaterRippleChart'" class="detail">
    <h2>水波图</h2>
    <h3>水波图只能取1-5个度量</h3>
    <p>水波图，可用来展示出某个指标的完成进度</p>
  </div>
  <div v-else-if="chartName==='DetailTableChart'" class="detail">
    <h2>明细表</h2>
    <h3>维度和度量的取值无限制</h3>
    <p>支持查看多个维度或指标的未汇总的明细清单</p>
  </div>
  <div v-else-if="chartName==='AreaChart'" class="detail">
    <h2>面积图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>与线图类似，面积图可用来展示在一定时间内数据的趋势走向以及它们所占的面积比例。</p>
  </div>
  <div v-else-if="chartName==='CombineChart'" class="detail">
    <h2>组合图</h2>
    <h3>类别轴上至少取1个维度，主值轴或者副值轴上至少取1个度量，分别对应左右轴;颜色图例至多取1个维度字段。</h3>
    <p>支持双轴展示不同量级数据，并在单边下支持常规线柱面混合、堆积混合、百分比堆积的复杂场景展示;表示不同项目间的变化趋势。</p>
  </div>
  <div v-else-if="chartName==='LineChart'" class="detail">
    <h2>线图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>线图可用来展示在相等的时间间隔下数据的趋势走向。</p>
  </div>
  <div v-else-if="chartName==='PercentStackedAreaChart'" class="detail">
    <h2>百分比堆叠面积图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>在层叠面积图的基础之上，将各个面积的因变量的数据使用加和后的总量进行归一化就形成了百分比层叠面积图。</p>
  </div>
  <div v-else-if="chartName==='StackedAreaChart'" class="detail">
    <h2>堆积面积图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>和基本面积图一样，唯的区别就是图上每一个数据集的起点不同，起点是基于前一个数据集的，用于显示每个数值所占大小随时间或类别变化的趋势线，展示的是部分与整体的关系。</p>
  </div>
  <div v-else-if="chartName==='BarChart'" class="detail">
    <h2>柱图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>柱图可用来比较各组数据之间的差别，并且可以显示一段时间内的数据变化情况。</p>
  </div>
  <div v-else-if="chartName==='HorizontalBarChart'" class="detail">
    <h2>条形图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例.上只能取维度字段，并且最多取1个维度。</h3>
    <p>与柱图类似，条形图用横向的展示方式来比较数据之间的大小以及各项之间的差距。</p>
  </div>
  <div v-else-if="chartName==='PSHorizontalBarChart'" class="detail">
    <h2>百分比堆积条形图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>条形图的各个层代表的是该类别数据占该分组总体数据的百分比。用于形象得展示一个大分类包含的每个小分类的数据，以及各个小分类的占比，显示的是单个项目与整体之间的关系。</p>
  </div>
  <div v-else-if="chartName==='StackedHorizontalBarChart'" class="detail">
    <h2>百分比堆积条形图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>条形图的各个层代表的是该类别数据占该分组总体数据的百分比。用于形象得展示
      一个大分类包含的每个小分类的数据，以及各个小分类的占比，显示的是单个项目与整体之间的关系。</p>
  </div>
  <div v-else-if="chartName==='StackedBarChart'" class="detail">
    <h2>堆积柱状图</h2>
    <h3>配置规则: 1个或2个维度，2个或多个数值(存在对比时允许只使用1个数值)支持对比。</h3>
    <p>堆叠柱状图可以形象地展示一个大分类包含的每个小分类的数据，以及各个小分类的占比，显示的是单个项目与整体之间的关系。</p>
  </div>
  <div v-else-if="chartName==='PercentStackedBarChart'" class="detail">
    <h2>百分比堆积柱状图</h2>
    <h3>类别轴上至少取1个维度;值轴上至少取1个度量;颜色图例上只能取维度字段，并且最多取1个维度。</h3>
    <p>柱子的各个层代表的是该类别数据占该分组总体数据的百分比。用于形象地展示一个大分类包含的每个小分类的数据，以及各个小分类的占比，显示的是单个项目与整体之间的关系。</p>
  </div>
  <div v-else-if="chartName==='PieChart'" class="detail">
    <h2>饼图</h2>
    <h3>扇区标签区域最多取1个维度，如区域、产品类型等;扇区角度区域最多取1个度量，如订单数量、利润金额等</h3>
    <p>饼图可用来展示数据中各项的大小与各项总和的比例。</p>
  </div>
  <div v-else-if="chartName==='RoseChart'" class="detail">
    <h2>玫瑰图</h2>
    <h3>扇区长度仅能取一个度量，扇取标签仅能取一个维度</h3>
    <p>玫瑰图可用来展示每一个数值相对总值的大小</p>
  </div>
  <div v-else-if="chartName==='WordCloudChart'" class="detail">
    <h2>词云图</h2>
    <h3>词标签只能取1个维度;词大小只能取1个度量</h3>
    <p>词云图可用来做用户画像和用户标签。</p>
  </div>
  <div v-else-if="chartName==='BubbleChart'" class="detail">
    <h2>气泡图</h2>
    <h3>气泡图与散点图相似，不同之处在于:气泡图允许在图表中加入一个表示大小的变量进行对比。</h3>
    <p>气泡图是可用于展示5个变量之间的关系。</p>
  </div>
  <div v-else-if="chartName==='FunnelChart'" class="detail">
    <h2>漏斗图</h2>
    <h3>支持两种数据配置，第一种，漏斗分层取1个维度，漏斗层宽取1个度量;第二种，漏斗分层无维度，漏斗层宽取1-10个度量</h3>
    <p>漏斗图可用来展示业务各环节的转化情况。</p>
  </div>
  <div v-else-if="chartName==='ScatterChart'" class="detail">
    <h2>散点图</h2>
    <h3>是以一个变量为横坐标，另一变量为纵坐标，表示因变量(Y轴数值)随自变量(X轴数值)变化的大致趋势，同时支持从类别、颜色二维观察数据的分布情况</h3>
    <p>散点图用来展示数据的相关性和分布关系。</p>
  </div>
  <div v-else-if="chartName==='ColorMapChart'" class="detail">
    <h2>色彩地图</h2>
    <h3>地理区域只能取1个维度，并且维度类型必须为地理信息;色彩饱和度最少取1个，最多取5个度量</h3>
    <p>色彩地图用色彩的深浅来展示数据的大小和分布范围。</p>
  </div>
  <div v-else-if="chartName==='LineMapChart'" class="detail">
    <h2>Ibs飞线地图</h2>
    <h3>地理区域最多只能取2个维度，并且维度类型必须为地理信息，如区域，省，城市等; LBS飞线度量区域最少取1个，并且最多取5个度量。</h3>
    <p>以一个地图轮廓为背景，用动态的飞线反映两地或者多地之间的数据大小，而且，还可以直观地显示国家或地区的相关数据指标大小和分布范围。</p>
  </div>
  <div v-else-if="chartName==='ScatterMapChart'" class="detail">
    <h2>气泡地图</h2>
    <h3>地理区域最多只能取1个维度，并且维度类型必须为地理信息，如区域，省，城市等;气泡大小区域最少取1个，并且最多取5个度量</h3>
    <p>气泡地图可以直观地显示国家或地区的相关数据指标大小和分布范围。</p>
  </div>
</template>
<script>
export default {
  name: 'ChartDescription',
  props: {
    chartName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  mounted () {
    console.log('巴拉巴拉    ', this.chartName)
  }
  // methods: {
  // }
}
</script>
<style lang="scss" scoped>
.detail {
  width: 240px;
  h2 ,h3 ,p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
