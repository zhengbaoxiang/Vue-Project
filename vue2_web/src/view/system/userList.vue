<template>
	<div class="userList">
		<div style="padding: 20px 0">
			<Form inline>
				<FormItem>
					模糊搜索:
					<Input
						placeholder="请输入"
						clearable
						style="width: 200px"
						v-model="pageInfo.data.keyword"
					/>
				</FormItem>
				<FormItem>
					当前状态:
					<Select
						v-model="pageInfo.data.status"
						placeholder="请选择"
						style="width: 100px"
					>
						<Option :value="1">启用 </Option>
						<Option :value="0">停用</Option>
					</Select>
				</FormItem>
				<Button icon="md-search" class="ml10" @click="lookUp"
					>查询</Button
				>
				<Button class="ml10 fr" @click="reset">重置</Button>
				<Button type="primary" class="ml10 fr" @click="toAdd"
					>新增</Button
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
			<template slot="operate" slot-scope="{ row }">
				<!-- <Button
					type="warning"
					@click="toEdit(row)"
					icon="md-create"
				></Button>
				<Button
					type="error"
					class="ml10"
					@click="del(row)"
					icon="ios-trash-outline"
				></Button> -->
				<!-- <Button class="ml10" @click="changePassword(row)"
					>修改密码</Button
				> -->
				<span class="text-link" @click="toEdit(row)">编辑</span>
				<span class="text-link ml10" @click="del(row)">删除</span>
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
		<Modal
			v-model="showPageModal"
			:title="pageForm.id ? '编辑' : '新增'"
			class="userModal"
		>
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
				v-if="showPageModal"
			>
				<FormItem prop="userId" label="用户账号">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.userId"
						:disabled="!!pageForm.id"
					/>
				</FormItem>
				<FormItem prop="username" label="用户姓名">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.username"
					/>
				</FormItem>
				<!-- <FormItem label="密码" prop="password" v-if="!pageForm.id">
					<Input
						v-model="pageForm.password"
						placeholder="请输入密码"
						style="width: 300px"
						type="password"
						password
					></Input>
				</FormItem>
				<FormItem label="确认密码" prop="password2" v-if="!pageForm.id">
					<Input
						v-model="pageForm.password2"
						placeholder="请输入密码"
						style="width: 300px"
						type="password"
						password
					></Input>
				</FormItem> -->
                <!-- 是否多选 -->
                <!-- multiple 	:max-tag-count="2" -->
				<FormItem prop="roleCode" label="用户角色">
					<Select
						v-model="pageForm.roleCode"
						placeholder="请选择"
						style="width: 300px"
					>
						<Option
							v-for="item in roleList"
							:value="item.id"
							:key="item.id"
							>{{ item.name }}</Option
						>
					</Select>
				</FormItem>
				<FormItem prop="status" label="状态">
					<Select
						v-model="pageForm.status"
						placeholder="请选择"
						style="width: 300px"
					>
						<Option :value="1">启用</Option>
						<Option :value="0">停用</Option>
					</Select>
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
// import { mapState } from "vuex";
import { userApi, roleApi } from "@/api/system";
export default {
	computed: {
		// ...mapState({
		// 	auth: (state) => state.user.auth,
		// }),
	},
	data() {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: "center",
					title: "用户账户",
					key: "userId",
					minWidth: 100,
				},
				{
					align: "center",
					title: "用户姓名",
					key: "username",
					minWidth: 100,
				},
				{
					align: "center",
					title: "用户角色",
					key: "roleName",
					minWidth: 120,
				},
				{
					align: "center",
					title: "状态",
					key: "statusName",
					minWidth: 80,
				},
				{
					align: "center",
					title: "修改时间",
					key: "updateTime",
					minWidth: 100,
				},
				{
					align: "center",
					title: "操作",
					slot: "operate",
					minWidth: 100,
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
			passwordRule: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,20}/,
			accountRule: /^[A-Za-z0-9_]{3,20}$/,
			pageRule: {
				userId: [
					{
						required: true,
						trigger: "blur",
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error("请输入账号"));
							} else if (!this.accountRule.test(value)) {
								callback(
									new Error(
										"账户只能是数字、字母和下划线,3-20位"
									)
								);
							} else {
								callback();
							}
						},
					},
				],
				username: [
					{
						required: true,
						message: "请输入姓名",
						trigger: "blur",
					},
				],
				password: [
					{
						required: true,
						trigger: "blur",
						type: "string",
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error("请输入密码"));
							} else if (!this.accountRule.test(value)) {
								callback(
									new Error(
										// "密码必须数字加特殊字符加字母大小写,长度需6-20位"
										"密码只能是数字、字母,长度需6-20位"
									)
								);
							} else {
								callback();
							}
						},
					},
				],
				password2: [
					{
						required: true,
						trigger: "blur",
						type: "string",
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error("请再次输入密码"));
							} else if (value !== this.pageForm.password) {
								callback(new Error("两次密码不一致"));
							} else {
								callback();
							}
						},
					},
				],
				roleCode: [
					{
						required: true,
						message: "请选择角色",
						trigger: "change",
						type: "string",
					},
				],
				status: [
					{
						required: true,
						message: "请选择状态",
						trigger: "change",
						type: "number",
					},
				],
			},
			// 确认按钮loading
			confirmLoading: false,
			roleList: [],
			leaderList: [],
			dutyList: [
				{
					code: 1,
					name: "维护系统",
				},
				{
					code: 2,
					name: "业务主管",
				},
			],
		};
	},
	methods: {
		// 获取表格数据
		getTableList() {
			this.tableLoading = true;

			userApi
				.getUserList(this.pageInfo)
				.then((res) => {
					const list = res.data.list || [];
					list.forEach((item) => {
						item.statusName = item.status ? "启用" : "禁用";
					});

					this.tableList = list;

					this.pageInfo.total = res.data.total;
					this.tableLoading = false;
				})
				.catch((err) => {
					this.tableLoading = false;
					this.pageInfo.total = 0;
				});
		},
		initial() {
			// 获取所有角色列表
			roleApi
				.getAllRoleList()
				.then((res) => {
					const list = res.data || [];
					list.forEach((item) => {
						item.id = item.roleCode;
						item.name = item.roleName;
					});
					this.roleList = list;
				})
				.catch((err) => {
					this.roleList = [];
				});
		},
		dutyChange(value) {
			// 重置表单时，会触发
			console.log("-dutyChange->", value, "<-");
			if (!value && value !== 0) return;
		},

		// 去新增
		toAdd() {
			this.leaderList = [];
			this.pageForm = {
				id: null,
			};
			this.showPageModal = true;
			this.$refs.pageForm.resetFields();
		},
		// 去编辑
		toEdit(r = {}) {
			this.pageForm = {
				...r,
			};
			this.showPageModal = true;
			this.$refs.pageForm.resetFields();
		},
		// 确认
		confirmPage() {
			console.log("this.pageForm:", this.pageForm);
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
			try {
				userApi
					.add({
						...this.pageForm,
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
			} catch (error) {
				console.log("-->", error, "<-");
			}
		},
		// 编辑
		edit() {
			this.confirmLoading = true;
			userApi
				.update({
					...this.pageForm,
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
					userApi
						.deleteItem({
							id: r.id,
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
		this.getTableList();
		setTimeout(() => {
			this.initial();
		}, 1000);
	},
};
</script>
<style lang="less">
.userModal {
	.ivu-form-item {
		margin-bottom: 18px;
	}
}
</style>
