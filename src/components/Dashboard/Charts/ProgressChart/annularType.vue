<template>
  <div class="container">
    <el-progress
      type="circle"
      :stroke-width="13"
      :show-text="false"
      :percentage="setProgress"
      :color="getColor"
      :width="150"
    />
    <div class="box">
      <div>
        <span :style="stylePercent">{{ setProgress }}%</span><br>
        <span :style="styleTitle">{{ data.name }}</span>
      </div>
    </div>
    <div v-if="getValueShow" class="text" :style="styleDesc">
      <span>{{ option.value.current }} {{ data.value }}</span>
      <br>
      <span>{{ option.value.target }} {{ data.target }}</span>
    </div>
  </div>
</template>

<script>
import progressMixins from './progressMixins'
export default {
  name: 'AnnularType',
  mixins: [progressMixins]
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  .box {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, 0%);
    text-align: center;
  }
  .text {
    margin-bottom: 10px;
  }
}
</style>
