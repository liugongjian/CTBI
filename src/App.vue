<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style  >
* {
  margin: 0px;
  padding: 0px;
}
body {
  height: 100%;
  width: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
html {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
