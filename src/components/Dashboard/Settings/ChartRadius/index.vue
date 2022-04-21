<template>
  <div class="editor-object-container">
    半径比例
    <el-select
      v-model="option[1]"
      placeholder="请选择"
      @change="changeHandler"
    >
      <el-option
        v-for="item in radiusList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'ChartRadius',
  components: {},
  props: {
    option: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      radiusList: [{
        value: '100%',
        label: '100%'
      }, {
        value: '90%',
        label: '90%'
      }, {
        value: '80%',
        label: '80%'
      }, {
        value: '70%',
        label: '70%'
      }, {
        value: '60%',
        label: '60%'
      }, {
        value: '50%',
        label: '50%'
      }, {
        value: '45%',
        label: '45%'
      }, {
        value: '35%',
        label: '35%'
      }]
    }
  },
  methods: {
    changeHandler (n, o) {
      // 重新设置图形直径，如果内径为0则不做控制，否则默认直径-20
      if (this.option[0] !== '0%') {
        // 去除百分号，将直径转成数字 直径最小35%
        const maxLabel = this.option[1]
        const maxNumber = Number.parseInt(maxLabel.replace('%'))
        this.option[0] = (maxNumber - 20) + '%'
      }
    }
  }
}
</script>
