<!--
 * @Date: 2022-02-08 16:52:20
 * @LastEditors: zbx
 * @LastEditTime: 2022-02-21 16:48:57
 * @FilePath: \frontCode\src\components\common-table\common-table.vue
-->
<template>
	<div class="tableCom">
		<Table
			:data="tableList"
			:columns="tableColumn"
			:loading="tableLoading"
			border
			max-height="750"
			row-key="id"
		>
			<template slot="workOrderNo" slot-scope="{ row }">
				<span @click="getDetail(row)" class="workOrderNo">{{
					row.workOrderNo
				}}</span>
			</template>
		</Table>
		<div style="padding: 20px 0; text-align: right">
			<Page
				v-show="dataTotal"
				:current="pageInfo.currPage"
				:page-size="pageInfo.pageSize"
				:total="dataTotal"
				show-elevator
				show-total
				@on-change="changePage"
				@on-page-size-change="changePageSize"
			></Page>
		</div>
	</div>
</template>

<script>
export default {
	name: "CommonTable",
	props: {
		tableColumn: {
			type: Array,
			required: true,
			default: () => {
				return [];
			},
		},
		tableList: {
			type: Array,
			required: true,
			default: () => {
				return [];
			},
		},
		outPageInfo: {
			type: Object,
			required: true,
			default: () => {
				return {};
			},
		},
		dataTotal: {
			type: Number,
			required: true,
		},
	},
	watch: {
		outPageInfo(value) {
			// console.log('--watch>',value,'<-');
			this.pageInfo = { ...value };
		},
	},
	data() {
		return {
			// 表格loading
			tableLoading: false,
			// 查询信息
			pageInfo: {
				currPage: 1,
				pageSize: 5,
			},
		};
	},
	methods: {
		getTableList() {
			this.$emit("getTableList", this.pageInfo);
		},
		getDetail(row) {
			// console.log("--->", row, "<---");
			this.$emit("getDetail", row);
		},
		// 切换页面
		changePage(p) {
			this.pageInfo.currPage = p;
			this.getTableList();
		},
		// 且页面大小
		changePageSize(ps) {
			this.pageInfo.pageSize = ps;
			this.pageInfo.currPage = 1;
			this.getTableList();
		},
		// 查询
		lookUp() {
			this.pageInfo.currPage = 1;
			this.getTableList();
		},
	},
};
</script>

<style lang="less">
.tableCom {
	table th {
		padding: 2px 0;
	}
	.workOrderNo {
		color: #f60;
		cursor: pointer;
		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
