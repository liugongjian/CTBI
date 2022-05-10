<template>
  <div
    class="select"
    :class="{'open':showOption}"
  >
    <div
      class="select-get-option"
      @click="showOption=!showOption"
    >
      <span
        class="select-value"
        :title="value"
      >{{ value }}</span>
    </div>
    <div class="select-option-list">
      122
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataSetSelect',
  data () {
    return {
      value: '请选择数据集',
      showOption: false // 是否展示选项
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
$base-bgc: #2e74ff;
.select {
  flex: 1;
  position: relative;
  height: 24px;
  & > * {
    box-sizing: border-box;
  }
  &-get-option {
    width: 100%;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    padding-left: 10px;
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
    transition: width 0.2s linear;
    background-color: $base-bgc;
  }
  &-get-option::after {
    display: inline-block;
    content: '';
    width: 16px;
    height: 16px;
    background-size: 16px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M757.76 637.44L538.88 883.2c-14.72 16.64-40.32 16.64-54.4 0L265.6 637.44c-21.12-23.68-4.48-61.44 27.52-61.44h437.76c31.36 0 48.64 37.76 26.88 61.44z' fill='%23c0c3cb'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    position: relative;
    transition: all 0.2s ease;
    background-position-y: -3px;
    left: -2px;
    top: 4px;
  }
}
.select-option-list{
    overflow-y: hidden;
    min-height: 60px;
    max-height: 480px;
    width: 100%;
    border-top: none;
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
    display: none;
    background-color: #081226;
    background-clip: padding-box;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
}
.select.open {
  .select-get-option {
    width: 320px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .select-get-option::after {
    transform: rotate(180deg);
  }
  .select-option-list{
    display: block;
    width: 320px;
  }
}

.select-value {
  display: block;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
