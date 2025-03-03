<!--
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2025-03-03 15:57:25
 * @FilePath: \management\src\App.vue
-->
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

<style lang="less">
.size {
    width: 100%;
    height: 100%;
}

html,
body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;

}

#app {
    width: 100%;
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;

    nav {
        padding: 30px;
        text-align: center;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
}
</style>
