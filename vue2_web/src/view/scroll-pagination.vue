<!--
 * @Date: 2025-12-03 19:11:03
 * @LastEditors: zbx
 * @LastEditTime: 2025-12-03 19:20:07
 * @descript: 文件描述
-->
<template>
    <div class="scroll-pagination-container" @scroll="handleScroll" ref="scrollContainer">
        <!-- 列表数据 -->
        <div class="list-item" v-for="(item, index) in listData" :key="index">
            {{ item.id }} - {{ item.name }}
        </div>

        <!-- 加载状态 -->
        <div class="loading" v-if="loading">加载中...</div>
        <div class="no-more" v-if="noMore">没有更多数据了</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            listData: [], // 已加载的列表数据
            page: 1, // 当前页码
            pageSize: 20, // 每页条数
            loading: false, // 加载中状态（防止重复请求）
            noMore: false, // 无更多数据
            total: 0, // 总数据量（模拟接口返回）
        };
    },
    mounted() {
        // 初始化加载第一页
        this.fetchData();
    },
    methods: {
        // 模拟接口请求数据
        async fetchData() {
            this.loading = true;
            try {
                const params = { page: this.page, pageSize: this.pageSize }
                // 模拟接口（实际项目替换为真实接口）
                // const res = await axios.get('/api/list', {
                //     params
                // });
                const tempList = [...Array(this.pageSize).keys()].map((i) => ({ id:`${this.page}-${i+1}`, name: `Item-${this.page}-${i + 1}` }))
                const res = {
                    data: {
                        data: tempList,
                        total: 100
                    }, 
                };

                const { data, total } = res.data;
                this.listData = this.page === 1 ? data : [...this.listData, ...data]; // 第一页覆盖，后续页拼接
                this.total = total;

                // 判断是否还有更多数据
                this.noMore = this.listData.length >= this.total;
                this.page++; // 页码+1
            } catch (err) {
                console.error('加载失败：', err);
            } finally {
                this.loading = false;
            }
        },

        // 监听滚动事件
        handleScroll() {
            const container = this.$refs.scrollContainer;
            // 滚动距离 = 容器高度 + 滚动偏移量 >= 内容高度 - 100px（接近底部 100px 触发加载）
            const shouldLoad =
                container.clientHeight + container.scrollTop >=
                container.scrollHeight - 100;

            // 满足条件 + 不在加载中 + 有更多数据
            if (shouldLoad && !this.loading && !this.noMore) {
                this.fetchData();
            }
        },
    },
};
</script>

<style scoped>
.scroll-pagination-container {
    width: 300px;
    height: 500px;
    overflow-y: auto;
    border: 1px solid #eee;
}

.list-item {
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    border-bottom: 1px solid #f5f5f5;
}

.loading,
.no-more {
    text-align: center;
    padding: 16px;
    color: #999;
}
</style>