<!--
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-16 14:48:50
 * @FilePath: \management\src\App.vue
-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
  
}
#app {
  .size;
}
</style>
