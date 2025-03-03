<!--
 * @Date: 2025-03-03 16:41:18
 * @LastEditors: zbx
 * @LastEditTime: 2025-03-03 19:30:31
 * @descript: 文件描述
-->
<template>
    <div class="searchArea">
        <form
            action="http://www.baidu.com/s"
            class="search_form"
            target="_blank"
        >
            <a href="http://www.baidu.com/"></a>
            <input
                type="text"
                name="wd"
                id="input_con"
                placeholder="search"
                :value="inputValue"
                autofocus
                autocomplete="off"
            />
        </form>
    </div>
</template>
<script>
export default {
    name: 'searchArea',
    components: {},
    props: {},
    data() {
        return {
            inputValue: ''
        }
    },
    created() {},
    mounted() {},
    activated() {},
    methods: {}
}
</script>
<style lang="less" scoped>
.searchArea {
    width: 100%;
    margin: 0 auto;
    padding-top: 5%;
    width: 35%;
    min-width: 330px;
    max-width: 650px;

    .search_form {
        display: inline-block;
        width: 100%;
        height: 45px;
        line-height: 45px;

        font-size: 0;
        border: 2px solid rgba(0, 144, 252, 1);
        border-radius: 20px;
        background-color: #fff;
        overflow: hidden;
        a {
            display: inline-block;
            height: 100%;
            width: 30px;
            margin: 0 12px;
            vertical-align: middle;
            background: url('../../../assets/images/baidu.png') center -2px no-repeat;
            background-size: cover;
        }
        #input_con {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            width: ~"calc(100% - 65px)";
            margin: 0  5px;
            padding: 0px 0px;
            font: normal 18px/37px 'KaiTi';
            color: rgba(51, 51, 51, 1);
            /*/* 去掉获得焦点(点击)时显示的蓝色的框   */
            outline: none;
        }
    }
}
</style>
