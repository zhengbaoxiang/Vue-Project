<!--
 * @Date: 2025-12-03 18:58:50
 * @LastEditors: zbx
 * @LastEditTime: 2025-12-03 19:56:08
 * @descript: 文件描述
-->
<template>
    <!-- 虚拟列表容器：固定高度 + 溢出滚动 -->
    <div class="virtual-list-container" @scroll="handleScroll" ref="listContainer">
        <!-- 占位容器：撑起列表高度，实现滚动效果 -->
        <div class="virtual-list-placeholder" :style="{ height: totalHeight + 'px' }"></div>

        <!-- 可视区域数据：绝对定位，滚动时更新位置和数据 -->
        <div class="virtual-list-content" :style="{ transform: `translateY(${scrollTop}px)` }">
            <div class="list-item" :style="{ height: itemHeight + 'px' }"
                style="border-bottom: 1px solid #ccc; box-sizing: border-box; " v-for="(item, index) in visibleData"
                :key="index">
                {{ item.id }} - {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            totalData: [], // 全部大数据（模拟 10000 条）
            visibleData: [], // 可视区域数据
            itemHeight: 50, // 每条数据固定高度（px）
            containerHeight: 500, // 列表容器高度（px）
            scrollTop: 0, // 滚动偏移量（px）
            visibleCount: 0, // 可视区域可容纳的 item 数量
            startIndex: 0, // 可视区域起始索引
            endIndex: 0, // 可视区域结束索引
        };
    },
    computed: {
        totalHeight() {
            // 总列表高度 = 总数据量 * 每条高度
            return this.totalData.length * this.itemHeight;
        },
    },
    mounted() {
        // 1. 模拟生成 10000 条大数据
        this.totalData = Array.from({ length: 10000 }, (_, i) => ({
            id: i + 1,
            name: `列表项 ${i + 1}`,
        }));

        // 2. 初始化可视区域参数
        this.visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
        this.startIndex = 0;
        this.endIndex = this.visibleCount + 2; // 多渲染 2 条，避免滚动时空白

        // 3. 首次渲染可视区域数据
        this.updateVisibleData();
    },
    methods: {
        handleScroll() {
            // 1. 获取滚动偏移量
            this.scrollTop = this.$refs.listContainer.scrollTop;

            // 2. 计算新的起始/结束索引
            this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
            this.endIndex = this.startIndex + this.visibleCount + 2;

            console.log('滚动中...',this.scrollTop, this.startIndex, this.endIndex);

            // 3. 更新可视区域数据
            this.updateVisibleData();
        },
        updateVisibleData() {
            // 截取可视区域数据（防止索引越界）
            this.visibleData = this.totalData.slice(
                Math.max(0, this.startIndex),
                Math.min(this.totalData.length, this.endIndex)
            );

            // 调整内容定位：让可视数据始终在容器视口内
            this.scrollTop = this.startIndex * this.itemHeight;
        },
    },
};
</script>

<style scoped>
.virtual-list-container {
    position: relative;
    width: 300px;
    height: 500px;
    overflow-y: auto;
    border: 1px solid #eee;
}

.virtual-list-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
}

.virtual-list-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
}

.list-item {
    line-height: 50px;
    padding: 0 16px;
    border-bottom: 1px solid #f5f5f5;
}
</style>