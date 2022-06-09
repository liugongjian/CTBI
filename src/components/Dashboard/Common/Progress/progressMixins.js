export default {
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    progressConfig: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      target: null
    }
  },
  computed: {
    styleTitle () {
      return JSON.stringify(this.option) === '{}' ? {} : {
        color: this.option.indicators[0].color,
        fontSize: `${this.option.indicators[0].fontSize}px`
      }
    },
    setProgress () {
      const item = this.progressConfig.cfgTargetOption.find(item => item.name === this.data.name) || {}
      this.target = (item.type === 1 ? item.fixedVal : item.dynamicVal) || this.data.value
      return (Number(this.data.value / this.target * 100)).toFixed(this.progressConfig.proportion.decimal)
    },
    getColor () {
      // name可能会出现重名,后期更换成id
      return this.option.color.find(item => item.name === this.data.name).color
    },
    styleProgress () {
      return {
        backgroundColor: this.getColor,
        width: `${this.setProgress}%`
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
