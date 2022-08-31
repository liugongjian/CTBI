<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-25 13:49:31
 * @Description:
-->
<template>
  <div class="container">
    <div class="title" :style="styleTitle">{{ data.name }}</div>
    <div class="picture">
      <div class="progress">
        <div class="box" :style="styleProgress" />
      </div>
      <span :style="stylePercent">{{ setProgress }}%</span>
    </div>
    <div v-if="getValueShow" class="desc" :style="styleDesc">
      <span>{{ option.value.current }} {{ Number(data.value) }}</span>
      <span class="symbol">|</span>
      <span>{{ option.value.target }} {{ Number(target) }}</span>
    </div>
  </div>
</template>

<script>
import progressMixins from './progressMixins'
export default {
  name: 'BarType',
  mixins: [progressMixins]
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 15px;
  margin-right: 10px;
  text-align: left;
  .picture {
    display: flex;
    align-items: center;
    .progress {
      flex: 1;
      height: 15px;
      overflow: hidden;
      margin: 5px 5px 5px 0px;
      border-radius: 2px;
      background-color: #e5e7ee;
      .box {
        z-index: 1;
        height: 15px;
        width: 100%;
        border-radius: 2px;
        background-color: aqua;
      }
    }
  }
  .desc {
    .symbol {
      margin: 0 5px;
    }
  }
}
</style>
