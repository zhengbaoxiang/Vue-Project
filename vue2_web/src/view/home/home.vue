<!--
 * @Date: 2021-10-09 09:35:17
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-10 14:10:40
 * @FilePath: \management\src\view\home\home.vue
-->
<template>
	<Layout class="home-contain">
		<div class="bottomContain" >
			<div class="listCon">
				<div
					class="entryCon"
				>
					<span>工单入口:</span>
					<Button
						type="success"
						@click="addOrder(1)"
						>创建系统需求工单</Button
					>
					<Button
						type="warning"
						@click="addOrder(2)"
						>创建参数配置工单</Button
					>
					<Button
						type="error"
						@click="addOrder(3)"
						>创建系统缺陷工单</Button
					>
				</div>

				<p class="tableTitle">进行中的系统需求工单</p>
				<common-table
					:tableColumn="tableColumn"
					:tableList="demandList"
					:dataTotal="demandTotal"
					:outPageInfo="pageInfo"
					@getDetail="getDetail"
					@getTableList="getDemandList"
				></common-table>

				<p class="tableTitle">进行中的参数配置工单</p>
				<common-table
					:tableColumn="tableColumn"
					:tableList="parameterList"
					:dataTotal="parameterTotal"
					:outPageInfo="pageInfo"
					@getDetail="getDetail"
					@getTableList="getParameterList"
				></common-table>

				<p class="tableTitle">进行中的系统异常工单</p>
				<common-table
					:tableColumn="tableColumn"
					:tableList="bugList"
					:dataTotal="bugTotal"
					:outPageInfo="pageInfo"
					@getDetail="getDetail"
					@getTableList="getBugList"
				></common-table>

				<div class="noteTips em-title">
					<p>
						1.提交备注不影响审批流变动，用户可针对备注进行回复。已经完成审批的人员可以提交备注
					</p>
					<p>2.流程中的人员均可提交和回复备注，也可以通知其他人员</p>
				</div>
			</div>
			<div class="userFilterCon">
				<div class="headCon center">
					<div class="circle"></div>
					<p class="font16">{{ userName }}</p>
				</div>
				<div class="userFilter">
					<p>用户过滤</p>
					<RadioGroup
						v-model="userFilter"
						type="button"
						@on-change="userFilterChange"
					>
						<!-- <Radio :label="0">全部</Radio> -->
						<Radio :label="2">
							待我审批
							<Badge :count="undone" v-if="undone"></Badge>
						</Radio>
						<Radio :label="1"> 我创建的</Radio>
						<!-- <Radio :label="3"> 我参与的</Radio> -->
						<Radio :label="4"> 抄送我的</Radio>
					</RadioGroup>
				</div>
				<div class="timeFilter">
					<p>时间过滤</p>
					<RadioGroup
						v-model="timeFilter"
						type="button"
						@on-change="timeFilterChange"
					>
						<Radio :label="0">全部</Radio>
						<Radio :label="1"> 本周</Radio>
						<Radio :label="2"> 本月</Radio>
						<Radio :label="3"> 近三个月</Radio>
						<Radio :label="4"> 近六个月</Radio>
						<Radio :label="5"> 近一年</Radio>
					</RadioGroup>
				</div>
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

		<Modal
			v-model="addModal"
			title=""
			footer-hide
			:width="1000"
			class="addModal"
		>
			<addOrder
				v-if="addModal"
				:orderType="orderType"
				@submitClick="closeRefresh"
			></addOrder>
		</Modal>
	</Layout>
</template>
<script>
import { mapState } from "vuex";

import CommonTable from "@/components/common-table";
import orderDetail from "@/view/work-order/orderDetail";
import addOrder from "@/view/work-order/addOrder";

import { orderApi } from "@/api/workOrder";

export default {
	computed: {
		...mapState({
			userName: (state) => state.user.userName,
		}),
	},
	components: {
		CommonTable,
		orderDetail,
		addOrder,
	},
	data() {
		return {
			// 表格配置
			tableColumn: [
				{
					align: "center",
					title: "工单ID",
					slot: "workOrderNo",
					minWidth: 110,
				},
				{
					align: "center",
					title: "工单标题",
					key: "workOrderTitle",
					minWidth: 150,
				},
				{
					align: "center",
					title: "发起人",
					key: "sender",
					minWidth: 130,
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
					minWidth: 90,
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
				// 	minWidth: 150,
				// },
			],
			// 查询信息
			pageInfo: {},
			// 表格列表
			demandList: [],
			demandTotal: 0,
			parameterList: [],
			parameterTotal: 0,
			bugList: [],
			bugTotal: 0,
			// 过滤
			timeFilter: 0,
			userFilter: 2,

			currentPkWorkOrder: null,
			drawerFlag: false,
			orderType: 0,
			addModal: false,
			undone: 10,
		};
	},
	created() {
		this.initial();
	},
	mounted() {},
	methods: {
		initial() {
			this.pageInfo = {
				currPage: 1,
				pageSize: 5,
			};
			this.getDemandList(this.pageInfo);
			this.getParameterList(this.pageInfo);
			this.getBugList(this.pageInfo);
		},
		// 创建工单
		addOrder(type) {
			console.log("-->", type, "<-");
			this.orderType = type;
			this.addModal = true;

			// this.$router.push({
			// 	name: "addOrder",
			// 	query: {
			// 		orderType: type,
			// 	},
			// });
		},
		closeRefresh() {
			this.addModal = false;
			this.initial();
		},
		// 工单详情
		getDetail(row) {
			console.log("--->", row.workOrderNo, "<---");
			this.currentPkWorkOrder = row.pkWorkOrder;
			this.drawerFlag = true;
		},
		userFilterChange(value) {
			console.log("-userFilterChange->", value, "<-");
			this.userFilter = value;
			this.initial();
		},
		timeFilterChange(value) {
			console.log("-timeFilterChange->", value, "<-");
			this.timeFilter = value;
			this.initial();
		},
		// 获取表格数据
		getDemandList(pageInfo) {
			const params = {
				...pageInfo,
				data: {
					timeFilter: this.timeFilter,
					userFilter: this.userFilter,
					workOrderType: 1,
				},
			};
			// console.log("params-pageInfo", params);
			orderApi
				.pending(params)
				.then((res) => {
					const list = res.data.data || [];
					// list.forEach((item) => {
					// 	item.id = item.staffId;
					// });
					this.demandList = list;
					this.demandTotal = res.data.total;
				})
				.catch((err) => {
					this.demandList = [];
					this.demandTotal = 0;
				});
		},
		// 获取表格数据
		getParameterList(pageInfo) {
			const params = {
				...pageInfo,
				data: {
					timeFilter: this.timeFilter,
					userFilter: this.userFilter,
					workOrderType: 2,
				},
			};
			// console.log("params-pageInfo", params);
			orderApi
				.pending(params)
				.then((res) => {
					const list = res.data.data || [];
					this.parameterList = list;
					this.parameterTotal = res.data.total;
				})
				.catch((err) => {
					this.parameterList = [];
					this.parameterTotal = 0;
				});
		},
		// 获取表格数据
		getBugList(pageInfo) {
			const params = {
				...pageInfo,
				data: {
					timeFilter: this.timeFilter,
					userFilter: this.userFilter,
					workOrderType: 3,
				},
			};
			orderApi
				.pending(params)
				.then((res) => {
					const list = res.data.data || [];
					this.bugList = list;
					this.bugTotal = res.data.total;
				})
				.catch((err) => {
					this.bugList = [];
					this.bugTotal = 0;
				});
		},
	},
};
</script>

<style  lang="less" >
.home-contain {
	padding: 0;
	margin: 0;
	position: relative;
	height: 100%;
	.title {
		height: 90px;
		line-height: 90px;
		font-size: 24px;
		font-weight: bolder;
		color: #f40;
		margin: 100px auto;
		text-align: center;
	}
	.bottomContain {
		margin-top: 20px;
		height: ~"calc(100% - 60px)";

		display: flex;
		overflow: auto;
		.listCon {
			flex: 1 1 auto;
			width: ~"calc(100% - 420px)";
			background: #fff;
			margin-right: 20px;
			height: 100%;
			overflow: auto;
			padding: 15px;
			.entryCon {
				margin-bottom: 30px;
				.ivu-btn {
					margin-left: 15px;
				}
			}
			.tableTitle {
				font-weight: 700;
				font-size: 18px;
				color: #333333;
				margin-bottom: 10px;
			}
		}
		.userFilterCon {
			flex: 0 0 auto;
			// background: #fff;
			background: #fff8f3;
			width: 320px;
			height: 100%;
			.headCon {
				margin: 10px;
				.circle {
					margin: 0 auto 10px;
					width: 45px;
					height: 45px;
					border-radius: 50%;
					border: 1px solid grey;
					background-image: url("../../assets/images/headImg.png");
					background-size: contain;
				}
			}
			.userFilter,
			.timeFilter {
				padding: 5px 10px;
				p {
					padding: 5px;
					font-weight: 700;
				}
				.ivu-radio-group-item {
					width: 90px;
					text-align: center;
					border-radius: 5px;
					position: relative;
				}
				.ivu-badge {
					position: absolute;
					right: -13px;
					top: -12px;
				}
			}
			.ivu-radio-group {
				.ivu-radio-group-item {
					margin: 5px;
				}
			}
		}
	}
}
</style>

