<template>
  <div class="container" :style="getMoreRelation">
    <div v-for="(item,index) in data" :key="index" class="box" :style="getBox">
      <div class="item" :style="getItem">
        <div v-show="option.dimension" class="title" :style="getDimension">
          <span v-show="option.modified" class="round" :style="getRound(item.name)">
            <svg-icon
              :icon-class="getSvgIcon(item.name)"
            />
          </span>
          {{ item.name }}
        </div>
        <div v-for="(subItem, i) in item.data" :key="i" class="content">
          <template v-if="i === 0 && option.relation === 'deputy'">
            <span v-show="option.indicators" :style="getRelation">{{ subItem.title }}</span>
            <span :style="getRelationVal">{{ subItem.value }}</span>
          </template>
          <template v-else>
            <span :style="getTarget">{{ subItem.title }}</span>
            <span :style="getTargetVal" class="num">{{ subItem.value }}1</span>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Subregion',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    option: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getSvgIcon () {
      return function(name) {
        return this.option.setSvg.find(item => item.name === name).svg
      }
    },
    getRound() {
      return function(name) {
        return { 'background-color': this.option.color.find(item => item.name === name).color }
      }
    },
    getItem() {
      const data = {}
      if (this.option.position === 'left') {
        data.float = 'left'
      } else {
        data.margin = '0 auto'
        data['text-align'] = this.option.align
      }
      return data
    },
    getTargetVal() {
      return {
        ...this.getTarget,
        color: this.option.fontStyle?.target?.valColor,
        ...this.defaultStyle
      }
    },
    getTarget() {
      const { nameColor, fontSize } = this.option.fontStyle?.target || {}
      return {
        color: nameColor,
        fontSize: `${fontSize}px`,
        ...this.defaultStyle
      }
    },
    defaultStyle () {
      return this.option.fontStyle?.show ? { } : {
        color: '#393f4d',
        fontSize: '16px'
      }
    },
    getDimension() {
      const { color, fontSize } = this.option.fontStyle?.data[0] || {}
      return {
        color,
        fontSize: `${fontSize}px`,
        ...this.defaultStyle
      }
    },
    getIndicators() {
      const { color, fontSize } = this.option.fontStyle.data[1]
      return {
        color,
        fontSize: `${fontSize}px`,
        ...this.defaultStyle
      }
    },
    getRelationVal() {
      const { color, fontSize } = this.option.fontStyle.data[2]
      return {
        color,
        fontSize: `${fontSize}px`,
        ...this.defaultStyle
      }
    },
    getRelation() {
      return {
        width: this.option.relation === 'deputy' ? '100%' : '',
        ...this.getIndicators
      }
    },
    getBox() {
      return {
        width: this.option.moreRelation === 'line' ? '' : `${(1 / this.option.lineNum * 100).toFixed(0)}%`
      }
    },
    getMoreRelation() {
      return {
        flexWrap: this.option.moreRelation === 'line' ? 'nowrap' : 'wrap'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  .box {
    position: relative;
    border-bottom: 1px solid #e5e5e5;
  }
  .item {
    padding: 5px;
    padding-bottom: 5px;
    margin: 5px;
    width: 80%;
    &:before {
      content: '';
      position: absolute;
      left: -5px;
      bottom: 5px;
      display: inline-block;
      height: 90%;
      width: 1px;
      border-left: 1px solid #e5e5e5;
    }
  }
  .content {
    display: flex;
    justify-content:space-between;
    flex-wrap: wrap;
  }
}
.round {
  background-color: aqua;
  height: 100%;
  width: 20%;
  border-radius: 50%;
  text-align: center;
}
</style>
