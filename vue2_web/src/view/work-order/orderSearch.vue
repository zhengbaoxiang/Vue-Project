<!--
 * @Author: zbx
 * @Date: 2021-09-27 16:11:15
 * @LastEditTime: 2022-04-10 14:10:09
 * @LastEditors: zbx
 * @Description: 工单查询
 * @FilePath: \management\src\view\work-order\orderSearch.vue
-->
<template>
	<div class="orderSearch">
		<div class="second-nav">
			<RadioGroup
				v-model="userFilter"
				type="button"
				size="small"
				@on-change="userFilterChange"
			>
				<Radio :label="0"><span class="fontW700">全部</span></Radio>
				<Radio :label="1">
					<span class="fontW700">我创建的</span></Radio
				>
				<Radio :label="2">
					<span class="fontW700">我待办的</span></Radio
				>
				<Radio :label="3">
					<span class="fontW700">我参与的</span></Radio
				>
				<Radio :label="4"
					><span class="fontW700"> 抄送我的</span></Radio
				>
			</RadioGroup>
		</div>
		<div class="bottomContain">
			<div style="padding: 20px 0">
				<Form inline>
					<FormItem>
						工单ID:
						<Input
							placeholder="请输入"
							style="width: 150px"
							clearable
							v-model="pageInfo.data.workOrderNo"
						/>
					</FormItem>
					<FormItem>
						工单标题:
						<Input
							placeholder="支持模糊搜索"
							clearable
							style="width: 150px"
							v-model="pageInfo.data.workOrderTitle"
						/>
					</FormItem>
					<FormItem>
						工单类型:
						<Select
							v-model="pageInfo.data.workOrderType"
							placeholder="请选择"
							clearable
							style="width: 120px"
						>
							<Option :value="1">系统需求类 </Option>
							<Option :value="2">参数配置类</Option>
							<Option :value="3">系统异常类</Option>
						</Select>
					</FormItem>

					<FormItem>
						发起日期:
						<DatePicker
							type="daterange"
							split-panels
							placeholder="请选择时间范围"
							@on-change="dateSelect"
							style="width: 220px"
							v-model="daterange"
							format="yyyy-MM-dd"
						></DatePicker>
					</FormItem>
					<FormItem>
						发起人:
						<Select
							v-model="pageInfo.data.senderId"
							placeholder="请选择"
							style="width: 200px"
							:clearable="true"
							filterable
							:max-tag-count="1"
						>
							<Option
								v-for="item in userList"
								:value="item.code"
								:key="item.code"
								>{{ item.name }}</Option
							>
						</Select>
					</FormItem>
					<FormItem>
						当前处理人:
						<Select
							v-model="pageInfo.data.currentProcessor"
							:clearable="true"
							filterable
							placeholder="请选择"
							style="width: 200px"
						>
							<Option
								v-for="item in userList"
								:value="item.code"
								:key="item.code"
								>{{ item.name }}</Option
							>
						</Select>
					</FormItem>
					<FormItem>
						当前状态:
						<Select
							v-model="pageInfo.data.status"
							placeholder="请选择"
							style="width: 100px"
						>
							<Option :value="1">打开中 </Option>
							<Option :value="0">已关闭</Option>
						</Select>
					</FormItem>
					<Button
						type="primary"
						icon="md-search"
						class="ml10"
						@click="lookUp"
						>查询</Button
					>
					<Button class="ml10 fr" @click="reset">重置</Button>
					<Button
						type="success"
						class="ml10 fr"
						@click="exportExcel"
						:loading="exportLoading"
						>导出</Button
					>
				</Form>
			</div>
			<Table
				:data="tableList"
				:columns="tableColumn"
				:loading="tableLoading"
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
					:current="pageInfo.currPage"
					:page-size="pageInfo.pageSize"
					:total="pageInfo.total"
					show-elevator
					show-total
					show-sizer
					:page-size-opts="[10, 30, 50]"
					@on-change="changePage"
					@on-page-size-change="changePageSize"
				></Page>
			</div>
		</div>

		<Drawer
			v-model="drawerFlag"
			placement="right"
			width="720"
			title=""
			:closable="false"
			:mask-closable="true"
			class-name="orderDrawer"
		>
			<orderDetail
				v-if="drawerFlag"
				:currentPkWorkOrder="currentPkWorkOrder"
			></orderDetail>
		</Drawer>
	</div>
</template>
<script>
import orderDetail from "@/view/work-order/orderDetail";
import { orderApi } from "@/api/workOrder";

import { formatDate } from "@/libs/util";
import { handleBLob } from "@/libs/exportExcel";
export default {
	components: {
		orderDetail,
	},
	data() {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: "center",
					title: "工单ID",
					slot: "workOrderNo",
					minWidth: 100,
				},
				{
					align: "center",
					title: "工单标题",
					key: "workOrderTitle",
					minWidth: 150,
				},
				{
					align: "center",
					title: "工单类型",
					key: "workOrderType",
					minWidth: 80,
				},
				{
					align: "center",
					title: "发起人",
					key: "sender",
					minWidth: 100,
				},
				{
					align: "center",
					title: "发起日期",
					key: "sendTime",
					minWidth: 100,
				},
				{
					align: "center",
					title: "当前节点",
					key: "currentNode",
					minWidth: 80,
				},
				{
					align: "center",
					title: "当前处理人",
					key: "currentProcessor",
					minWidth: 150,
				},
				// {
				// 	align: "center",
				// 	title: "操作",
				// 	slot: "operate",
				// 	minWidth: 120,
				// },
			],
			// 表格loading
			tableLoading: false,
			// 导出loading
			exportLoading: false,
			// 查询信息
			pageInfo: {
				currPage: 1,
				pageSize: 10,
				total: 0,
				data: {},
			},
			drawerFlag: false,
			currentPkWorkOrder: {},
			userFilter: 1,
			daterange: [],
			userList: [
				{
					code: "zh",
					name: "zbx",
				},
			],
		};
	},
	created() {
		this.getTableList();
	},
	methods: {
		// 顶部选项卡切换
		userFilterChange(value) {
			console.log("-->", value, "<-");
			this.userFilter = value;

			this.getTableList();
		},
		// 时间组件改变值
		dateSelect(value) {
			console.log("dateSelect", value, this.daterange);
			this.daterange = value;

			this.pageInfo.data.dateFrom = formatDate(this.daterange[0], "date");
			this.pageInfo.data.dateTo = formatDate(this.daterange[1], "date");
		},
		getParams() {
			this.pageInfo.data.userFilter = this.userFilter;
			this.pageInfo.data.senderIds = this.pageInfo.data.senderId
				? [this.pageInfo.data.senderId]
				: [];
			this.pageInfo.data.currentProcessors = this.pageInfo.data
				.currentProcessor
				? [this.pageInfo.data.currentProcessor]
				: [];
		},
		// 获取表格数据
		getTableList() {
			this.tableLoading = true;
			this.getParams();
			orderApi
				.query(this.pageInfo)
				.then((res) => {
					const list = res.data.data || [];
					list.forEach((item) => {
						item.id = item.pkWorkOrder;
					});
					this.tableList = list;

					this.pageInfo.total = res.data.total;
					this.tableLoading = false;
				})
				.catch((err) => {
					this.tableLoading = false;
					this.tableList = [];
					this.pageInfo.total = 0;
				});
		},

		getDetail(row) {
			this.currentPkWorkOrder = row.pkWorkOrder;
			this.drawerFlag = true;
		},
		exportExcel() {
			this.getParams();

			console.log("-->", "导出", "<-");
			this.exportLoading = true;
			orderApi
				.exportOrder(this.pageInfo.data)
				.then((res) => {
					console.log("-->", res, "<-");
					// downloadExcelFile
					handleBLob(res);
					this.exportLoading = false;
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.exportLoading = false;
				});
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
		// 重置
		reset() {
			this.pageInfo.data = {};
			this.pageInfo.currPage = 1;
			this.daterange = [];
			this.getTableList();
		},
	},
	mounted() {},
};
</script>
<style  lang="less">
.orderSearch {
	.second-nav {
		background: #fff;
		padding: 10px 10px;
		margin-top: 10px;
		.ivu-radio-wrapper.ivu-radio-group-item {
			border: none;
			&::before,
			&::after {
				width: 0;
				height: 0;
				border: none;
				background: none;
			}
		}
		.ivu-radio-wrapper-checked,
		.ivu-radio-focus {
			box-shadow: none !important;
		}
	}
	.bottomContain {
		margin-top: 20px;
		height: ~"calc(100% - 60px)";
		padding: 0 20px;
		background: #fff;
		overflow: auto;
		.ivu-form-inline .ivu-form-item {
			margin-right: 20px;
			margin-bottom: 15px;
		}
		.workOrderNo {
			color: #f60;
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
