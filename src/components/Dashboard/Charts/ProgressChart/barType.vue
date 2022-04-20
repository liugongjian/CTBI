<template>
  <div class="container">
    <div class="title" :style="styleTitle">{{ data.name }}</div>
    <div class="picture">
      <div class="progress">
        <div class="box" :style="styleProgress" />
      </div>
      <span :style="stylePercent">10%</span>
    </div>
    <div v-if="getValueShow" class="desc" :style="styleDesc">
      <span>{{ option.value.current }} {{ data.value }}</span>
      <span class="symbol">|</span>
      <span>{{ option.value.target }} {{ data.target }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BarType',
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    styleTitle () {
      return JSON.stringify(this.option) === '{}' ? {} : {
        color: this.option.indicators[0].color,
        fontSize: `${this.option.indicators[0].fontSize}px`
      }
    },
    styleProgress () {
      return {
        backgroundColor: this.data.color
      }
    },
    stylePercent () {
      return JSON.stringify(this.option) === '{}' ? {} : {
        color: this.option.indicators[1].color,
        fontSize: `${this.option.indicators[1].fontSize}px`
      }
    },
    styleDesc () {
      return JSON.stringify(this.option) === '{}' ? {} : {
        color: this.option.value.style.color,
        fontSize: `${this.option.value.style.fontSize}px`
      }
    },
    getValueShow () {
      return JSON.stringify(this.option) === '{}' ? false : this.option.value.show
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 15px;
  margin-right: 10px;
  .picture {
    display: flex;
    align-items: center;
    .progress {
      flex: 1;
      height: 15px;
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
