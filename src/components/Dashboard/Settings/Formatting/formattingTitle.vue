<template>
  <div>
    <div class="field-box-wrapper">
      <div
        v-if="item"
        class="base-field-box measure-field-box dimension-field-box"
        :class="{
          'measure-field-box':item.type == 'measure',
          'dimension-field-box':item.type == 'dimension',
        }"
      >
        <svg-icon
          icon-class="data-type-option-number"
          style="width: 20px;height: 18px;margin-right: 2px;position: relative;top: 2px;"
        />
        <span class="field-caption">
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { boolean } from 'yargs'

export default {
  name: 'Title',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
.field-box-wrapper {display:flex;align-items:center;font-size:12px;height:22px;position:relative;margin:1px; background: #424550;
  .base-field-box {box-sizing:border-box;padding:0 8px;flex-grow:1;display:flex;align-items:center;height:100%;max-width:100%;border-radius:2px;overflow:hidden;
    .field-caption {flex-grow:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis; color: rgba(255, 255, 255, 0.75);}
    &:hover .right-hover-icons {display:block;}
    .right-hover-icons {color:hsla(0,0%,100%,.5);font-size:14px;white-space:nowrap;display:none;}
  }
  .dimension-field-box {background:rgba(255,172,46,0.10);border:1px solid rgba(255,172,46,0.3);border-radius:2px;}
  .measure-field-box {background:rgba(117,209,100,0.10);border:1px solid rgba(117,209,100,1);border-radius:2px;}
  .svg-icon {width:20px;height:20px;margin-right:2px;}
}

</style>
