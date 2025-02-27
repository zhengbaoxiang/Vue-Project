<!--
 * @Date: 2022-02-08 16:02:29
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-10 14:09:28
 * @Description: 工时详情

 * @FilePath: \management\src\view\work-order\manHour.vue
-->
<template>
	<div class="manHour">
		<div style="padding: 0 0 10px">
			<Form inline style="text-align: right">
				<Button type="primary" @click="toAdd">工时填报</Button>
			</Form>
		</div>
		<Table
			:data="tableList"
			:columns="tableColumn"
			:loading="tableLoading"
			border
			max-height="400"
			row-key="id"
		>
			<template slot="operate" slot-scope="{ row }">
				<Button
					type="warning"
					@click="toEdit(row)"
					icon="md-create"
				></Button>
				<Button
					type="error"
					class="ml10"
					@click="del(row)"
					icon="ios-trash-outline"
				></Button>
			</template>
		</Table>
		<!-- <div style="padding: 20px 0; text-align: right">
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
		</div> -->
		<Modal
			v-model="showPageModal"
			:title="pageForm.id ? '编辑' : '新增'"
			:mask-closable="false"
			class="manHourEditModal"
		>
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
			>
				<FormItem prop="duration" label="工时(h)">
					<InputNumber
						:min="0.5"
						:step="1"
						placeholder="请输入工时"
						style="width: 300px"
						v-model="pageForm.duration"
					></InputNumber>
				</FormItem>
				<FormItem prop="belongDate" label="工时所属日期">
					<DatePicker
						type="date"
						placeholder="请选择日期"
						style="width: 300px"
						@on-change="dateChange"
						v-model="pageForm.belongDate"
					></DatePicker>
				</FormItem>

				<FormItem prop="workflowApprovalId" label="工时类型">
					<Select
						v-model="pageForm.workflowApprovalId"
						@on-change="getWorkflowName"
						placeholder="请选择工时类型"
						style="width: 300px"
					>
						<Option
							v-for="item in typeList"
							:value="item.id"
							:key="item.id"
							>{{ item.name }}</Option
						>
					</Select>
				</FormItem>
				<FormItem prop="remark" label="工时备注">
					<Input
						v-model="pageForm.remark"
						maxlength="300"
						:rows="4"
						show-word-limit
						type="textarea"
						placeholder="简要说明工时投入在哪些事务"
						style="width: 300px"
					/>
				</FormItem>
			</Form>
			<template slot="footer">
				<Button @click="closePageModal">关闭</Button>
				<Button
					@click="confirmPage"
					type="primary"
					:loading="confirmLoading"
					>确定</Button
				>
			</template>
		</Modal>
	</div>
</template>
<script>
import { workHourApi } from "@/api/workOrder";
import { formatDate } from "@/libs/util";

export default {
	props: {
		currentPkWorkOrder: {
			type: String,
			required: true,
		},
	},
	watch: {
		currentPkWorkOrder(value) {
			console.log("--manhour - watch>", value, "<-");
			this.initial();
		},
	},
	data() {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: "center",
					title: "日期",
					key: "belongDate",
					minWidth: 80,
				},
				{
					align: "center",
					title: "登记人员",
					key: "registerName",
					minWidth: 120,
				},
				{
					align: "center",
					title: "工时类型",
					key: "approvalLinkName",
					minWidth: 100,
				},
				{
					align: "center",
					title: "工时",
					key: "duration",
					minWidth: 60,
				},
				{
					align: "center",
					title: "备注",
					key: "remark",
					minWidth: 100,
				},
				{
					align: "center",
					title: "操作",
					slot: "operate",
					minWidth: 150,
				},
			],
			// 表格loading
			tableLoading: false,
			// 查询信息
			pageInfo: {
				currPage: 1,
				pageSize: 10,
				total: 0,
				data: {},
			},
			// 展示页面modal
			showPageModal: false,
			// 弹窗页面表单
			pageForm: {},
			// 弹窗页面表单规则
			pageRule: {
				duration: [
					{
						required: true,
						message: "请输入",
						type: "number",
						trigger: "blur",
					},
				],
				belongDate: [
					{
						required: true,
						message: "请选择",
						type: "date",
						trigger: "change",
					},
				],
				workflowApprovalId: [
					{
						required: true,
						message: "请选择",
						trigger: "change",
						type: "string",
					},
				],
			},
			// 确认按钮loading
			confirmLoading: false,
			typeList: [],
		};
	},
	methods: {
		initial() {
			if (!this.currentPkWorkOrder) return;
			this.getTableList();
			// 获取所有选项
			const params = {
				workOrderId: this.currentPkWorkOrder,
			};
			workHourApi
				.queryWorkflowType(params)
				.then((res) => {
					const list = res.data || [];
					list.forEach((item) => {
						item.id = item.workflowApprovalId;
						item.name = item.approvalLinkName;
					});
					this.typeList = list;
				})
				.catch((err) => {
					this.typeList = [
						{
							id: "1",
							name: "开发",
						},
						{
							id: "2",
							name: "测试",
						},
					];
				});
		},
		// 获取表格数据
		getTableList() {
			this.tableLoading = true;

			const params = {
				workOrderId: this.currentPkWorkOrder,
			};
			workHourApi
				.getAllList(params)
				.then((res) => {
					let list = res.data || [];
					list.forEach((item) => {
						item.id = item.pkWorkinghours;
					});

					this.tableList = list;
					this.tableLoading = false;
				})
				.catch((err) => {
					this.tableLoading = false;
					this.tableList = [];
				});
		},
		dateChange(value) {
			console.log("-->", value, "<-");
			// this.pageForm.belongDate = value;
		},
		getWorkflowName(value) {
			console.log("-->", value, "<-");
			this.pageForm.workflowApprovalId = value;
			this.typeList.forEach((item) => {
				if (item.id === value) {
					this.pageForm.approvalLinkName = item.name;
				}
			});
		},

		// 去新增
		toAdd() {
			this.$refs.pageForm.resetFields();
			this.pageForm = {
				id: null,
				duration: 1,
			};
			this.showPageModal = true;
		},
		// 去编辑
		toEdit(r = {}) {
			// 根节点为0，0的时候前端置为null
			this.$refs.pageForm.resetFields();
			this.pageForm = {
				...r,
				belongDate: new Date(r.belongDate),
			};
			this.showPageModal = true;
		},
		// 确认
		confirmPage() {
			console.log("this.pageForm:", this.pageForm);
			this.pageForm.workOrderId = this.currentPkWorkOrder;
			// 整个表单校验
			this.$refs.pageForm.validate((v) => {
				if (v) {
					// 编辑
					if (this.pageForm.id) {
						this.edit();
						// 添加
					} else {
						this.add();
					}
				} else {
					console.log("校验失败");
				}
			});
		},
		// 添加
		add() {
			this.confirmLoading = true;
			workHourApi
				.addData({
					...this.pageForm,
					belongDate: formatDate(this.pageForm.belongDate),
				})
				.then((res) => {
					this.$Message.success("添加成功");
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getTableList();
				})
				.catch((err) => {
					this.confirmLoading = false;
				});
		},
		// 编辑
		edit() {
			this.confirmLoading = true;
			workHourApi
				.updateItem({
					...this.pageForm,
					belongDate: formatDate(this.pageForm.belongDate),
				})
				.then((res) => {
					this.$Message.success("编辑成功");
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getTableList();
				})
				.catch((err) => {
					this.confirmLoading = false;
				});
		},
		// 关闭弹窗
		closePageModal() {
			this.showPageModal = false;
		},
		// 删除
		del(r) {
			this.$Modal.confirm({
				title: "提示",
				content: "确定删除此条数据吗？",
				loading: true,
				onOk: () => {
					workHourApi
						.deleteItem({
							pkWorkinghours: r.id,
						})
						.then((res) => {
							this.$Message.success("删除成功");
							this.$Modal.remove();
							this.getTableList();
						})
						.catch((err) => {
							this.$Modal.remove();
						});
				},
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
			this.getTableList();
		},
	},
	mounted() {
		console.log("-manhour-mounted->", "<-");
		this.initial();
	},
};
</script>
<style lang="less">
.manHourEditModal {
	.ivu-form-item {
		margin-bottom: 20px;
	}
}
</style>